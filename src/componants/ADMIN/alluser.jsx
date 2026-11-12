import React, { useEffect, useState, useMemo } from "react";
import axios, { getBaseURL, setCustomBaseURL, LOCAL_URL, RENDER_URL } from "../../api/axios";
import { 
  Table, 
  Container, 
  Button, 
  Spinner, 
  Modal, 
  Form, 
  Alert, 
  Row, 
  Col, 
  Badge, 
  InputGroup 
} from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'danger' | 'warning', message: '' }
  const [currentApiUrl, setCurrentApiUrl] = useState(getBaseURL());

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await axios.get("/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      const isNetError = !error.response;
      setFeedback({
        type: "danger",
        message: isNetError 
          ? `Cannot reach backend at ${getBaseURL()}. Make sure your backend server is running (e.g. 'node server.js' on port 5000).`
          : (error.response?.data?.message || "Failed to load community users.")
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentApiUrl]);

  // Toggle backend server between Local and Render
  const toggleApiServer = () => {
    const nextUrl = currentApiUrl === LOCAL_URL ? RENDER_URL : LOCAL_URL;
    setCustomBaseURL(nextUrl);
    setCurrentApiUrl(nextUrl);
  };

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchQuery.toLowerCase();
      return (
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term))
      );
    });
  }, [users, searchQuery]);

  // Handle open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name || "",
      email: user.email || ""
    });
    setShowEditModal(true);
  };

  // Handle Edit Input Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Save Edited User
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    setFeedback(null);

    const payload = {
      name: editingUser.name,
      email: editingUser.email
    };

    try {
      let res;
      try {
        res = await axios.put(`/user/${editingUser._id}`, payload);
      } catch (firstErr) {
        res = await axios.put(`/users/${editingUser._id}`, payload);
      }

      const updated = res.data?.user || res.data?.User || { ...editingUser, ...payload };
      setUsers((prev) => 
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...updated } : u))
      );
      setShowEditModal(false);
      setFeedback({
        type: "success",
        message: `Member "${editingUser.name}" has been updated in MongoDB database!`
      });
    } catch (err) {
      console.error("Error updating user:", err);
      const is404 = err.response?.status === 404;
      const isNetError = !err.response;

      let msg = "Failed to update member in database.";
      if (is404) {
        msg = `Backend server (${getBaseURL()}) returned 404 for PUT /user/${editingUser._id}. The active server does not have the update route. If on local, run 'node server.js'. If on Render, push backend commits to GitHub.`;
      } else if (isNetError) {
        msg = `Cannot reach backend at ${getBaseURL()}. Please check that the server is running.`;
      } else {
        msg = err.response?.data?.message || err.message || msg;
      }

      setFeedback({
        type: "danger",
        message: msg
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  // Confirm Delete User
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    setFeedback(null);

    try {
      let deleteSuccess = false;

      try {
        await axios.delete(`/user/${deletingUser._id}`);
        deleteSuccess = true;
      } catch (firstErr) {
        try {
          await axios.delete(`/users/${deletingUser._id}`);
          deleteSuccess = true;
        } catch (secondErr) {
          throw secondErr.response ? secondErr : firstErr;
        }
      }

      if (deleteSuccess) {
        // Remove from list only when MongoDB has permanently deleted it
        setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
        setShowDeleteModal(false);
        setFeedback({
          type: "success",
          message: `Member "${deletingUser.name}" has been permanently removed from the database!`
        });
      }
    } catch (err) {
      console.error("Error deleting user from database:", err);
      const is404 = err.response?.status === 404;
      const isNetError = !err.response;

      let msg = "Failed to permanently delete member.";
      if (is404) {
        msg = `Backend (${getBaseURL()}) returned 404 for DELETE /user/${deletingUser._id}. The active server does not have the DELETE endpoint. If using local backend, ensure 'node server.js' on port 5000 is running. If using Render, commit and push backend changes to GitHub.`;
      } else if (isNetError) {
        msg = `Cannot reach backend server at ${getBaseURL()}. Make sure your backend (node server.js) is started on port 5000.`;
      } else {
        msg = err.response?.data?.message || err.message || msg;
      }

      // DO NOT delete from array so the user knows database deletion failed
      setShowDeleteModal(false);
      setFeedback({
        type: "danger",
        message: msg
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  const isUsingLocal = currentApiUrl.includes("localhost") || currentApiUrl.includes("127.0.0.1");

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 120px)" }} className="py-4">
      <Container>
        {/* Backend Endpoint Indicator Banner */}
        <div className="d-flex flex-wrap justify-content-between align-items-center bg-light border rounded-3 p-2 px-3 mb-3 small">
          <div className="d-flex align-items-center gap-2">
            <span className={`pulse-dot ${isUsingLocal ? "bg-success" : "bg-primary"}`}></span>
            <span className="text-muted">Target Backend:</span>
            <code className="text-dark fw-bold">{currentApiUrl}</code>
            <Badge bg={isUsingLocal ? "success" : "primary"}>
              {isUsingLocal ? "Local Server (Port 5000)" : "Remote Render Server"}
            </Badge>
          </div>
          <Button 
            variant="outline-dark" 
            size="sm" 
            className="py-0 px-2 fw-semibold"
            onClick={toggleApiServer}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Switch to {isUsingLocal ? "Remote Render" : "Local (Port 5000)"}
          </Button>
        </div>

        {/* Header Section */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-people-fill text-primary"></i>
              Community & Member Management
            </h2>
            <p className="text-secondary small mb-0">
              Inspect registered bidders, edit member details, or manage accounts.
            </p>
          </div>

          <div className="d-flex gap-2 mt-3 mt-sm-0">
            <Button 
              variant="outline-secondary" 
              className="rounded-3 d-flex align-items-center gap-1 shadow-sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </Button>
            <Link to="/register" className="text-decoration-none">
              <Button className="btn-bid-primary d-flex align-items-center gap-1 shadow-sm">
                <i className="bi bi-person-plus-fill"></i> Register Member
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <Alert 
            variant={feedback.type} 
            dismissible 
            onClose={() => setFeedback(null)}
            className="rounded-3 shadow-sm border"
          >
            {feedback.message}
          </Alert>
        )}

        {/* Search & Stats Bar */}
        <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
          <Row className="g-3 align-items-center">
            <Col md={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search community by member name or email address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-start-0 ps-0 shadow-none"
                />
                {searchQuery && (
                  <Button 
                    variant="link" 
                    className="text-muted text-decoration-none border-start-0 border"
                    onClick={() => setSearchQuery("")}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={5} className="text-md-end">
              <span className="text-secondary small me-3">
                Total Members: <strong className="text-dark">{users.length}</strong>
              </span>
              <span className="text-secondary small">
                Showing: <strong className="text-primary">{filteredUsers.length}</strong>
              </span>
            </Col>
          </Row>
        </div>

        {/* Table / Content */}
        {loading ? (
          <div className="text-center py-5 my-5 bg-white rounded-4 border shadow-sm">
            <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            <p className="mt-3 text-secondary fw-semibold">Loading registered community members...</p>
          </div>
        ) : (
          <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-light border-bottom text-uppercase small text-secondary">
                <tr>
                  <th style={{ width: "60px" }} className="ps-4">#</th>
                  <th>Member Name</th>
                  <th>Email Address</th>
                  <th>Joined Date</th>
                  <th>Role / Status</th>
                  <th style={{ width: "180px" }} className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id || index}>
                      <td className="ps-4 fw-bold text-secondary">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                            style={{ 
                              width: "40px", 
                              height: "40px", 
                              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                              fontSize: "0.9rem" 
                            }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark fs-6">{user.name}</div>
                            <small className="text-muted">ID: {user._id ? user._id.slice(-6) : 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-dark">{user.email}</span>
                      </td>
                      <td>
                        <span className="small text-dark d-block">
                          {user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })
                            : "N/A"}
                        </span>
                        <small className="text-muted">
                          {user.createdAt 
                            ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : ""}
                        </small>
                      </td>
                      <td>
                        <Badge bg="success-subtle" className="text-success border border-success-subtle px-2 py-1 rounded-pill">
                          <i className="bi bi-shield-check me-1"></i> Verified Bidder
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-2">
                          {/* Edit button */}
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            className="rounded-3 px-2 py-1 text-dark"
                            onClick={() => handleOpenEdit(user)}
                            title="Edit Member"
                          >
                            <i className="bi bi-pencil-square"></i> Edit
                          </Button>

                          {/* Delete button */}
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="rounded-3 px-2 py-1"
                            onClick={() => handleOpenDelete(user)}
                            title="Delete Member Permanently"
                          >
                            <i className="bi bi-trash3"></i> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="py-4">
                        <i className="bi bi-people text-muted fs-1 d-block mb-2"></i>
                        <h5 className="fw-bold text-dark">No Members Found</h5>
                        <p className="text-secondary small mb-3">
                          {searchQuery 
                            ? `No members matched "${searchQuery}".` 
                            : "There are currently no registered community members."}
                        </p>
                        {searchQuery && (
                          <Button size="sm" variant="outline-primary" onClick={() => setSearchQuery("")}>
                            Clear Search
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* ================= EDIT USER MODAL ================= */}
        <Modal 
          show={showEditModal} 
          onHide={() => !savingEdit && setShowEditModal(false)}
          backdrop="static"
          centered
        >
          <Form onSubmit={handleSaveEdit}>
            <Modal.Header closeButton={!savingEdit} className="border-bottom">
              <Modal.Title className="fw-bold fs-5">
                <i className="bi bi-pencil-square text-warning me-2"></i>
                Edit Member Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-3">
              {editingUser && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editingUser.name}
                      onChange={handleEditChange}
                      required
                      placeholder="e.g. John Doe"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editingUser.email}
                      onChange={handleEditChange}
                      required
                      placeholder="user@example.com"
                    />
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer className="border-top">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={savingEdit}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-bid-primary"
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    Saving to MongoDB...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i> Save Changes
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* ================= DELETE USER CONFIRMATION MODAL ================= */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => !isDeleting && setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton={!isDeleting} className="border-bottom">
            <Modal.Title className="fw-bold fs-5 text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Delete Member Account Permanently
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <p className="mb-2">
              Are you sure you want to permanently remove this user from the database:
            </p>
            <div className="p-3 bg-light rounded-3 border">
              <div className="fw-bold text-dark">{deletingUser?.name}</div>
              <small className="text-secondary">{deletingUser?.email}</small>
            </div>
            <small className="text-danger mt-2 d-block">
              <i className="bi bi-info-circle me-1"></i> This action will delete the member record and all bids made by this user permanently from MongoDB Atlas. This cannot be undone.
            </small>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" />
                  Deleting from Database...
                </>
              ) : (
                <>
                  <i className="bi bi-trash3 me-1"></i> Confirm Permanent Deletion
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminAllUsers;
