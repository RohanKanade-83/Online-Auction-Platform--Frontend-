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

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'danger' | 'warning', message: '' }
  const [currentApiUrl, setCurrentApiUrl] = useState(getBaseURL());

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await axios.get("/allproducts");
      setProducts(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      const isNetError = !error.response;
      setFeedback({
        type: "danger",
        message: isNetError 
          ? `Cannot connect to backend at ${getBaseURL()}. Make sure your server is running (e.g. 'node server.js' on port 5000).`
          : (error.response?.data?.message || "Failed to fetch auction products.")
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentApiUrl]);

  // Toggle backend server between Local and Render
  const toggleApiServer = () => {
    const nextUrl = currentApiUrl === LOCAL_URL ? RENDER_URL : LOCAL_URL;
    setCustomBaseURL(nextUrl);
    setCurrentApiUrl(nextUrl);
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const term = searchQuery.toLowerCase();
      return (
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    });
  }, [products, searchQuery]);

  // Handle opening the Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name || "",
      description: product.description || "",
      image: product.image || "",
      baseBid: product.baseBid !== undefined ? product.baseBid : "",
      auctionEndDate: product.auctionEndDate 
        ? new Date(product.auctionEndDate).toISOString().split("T")[0] 
        : ""
    });
    setShowEditModal(true);
  };

  // Handle Edit Input Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Save Edited Product
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingEdit(true);
    setFeedback(null);

    const payload = {
      name: editingProduct.name,
      description: editingProduct.description,
      image: editingProduct.image,
      baseBid: Number(editingProduct.baseBid),
      auctionEndDate: editingProduct.auctionEndDate
    };

    try {
      let res;
      try {
        res = await axios.put(`/product/${editingProduct._id}`, payload);
      } catch (firstErr) {
        res = await axios.put(`/products/${editingProduct._id}`, payload);
      }

      const updated = res.data?.product || res.data?.Product || { ...editingProduct, ...payload };
      setProducts((prev) => 
        prev.map((p) => (p._id === editingProduct._id ? { ...p, ...updated } : p))
      );
      setShowEditModal(false);
      setFeedback({
        type: "success",
        message: `Product "${editingProduct.name}" was successfully updated in MongoDB database!`
      });
    } catch (err) {
      console.error("Error updating product:", err);
      const is404 = err.response?.status === 404;
      const isNetError = !err.response;

      let msg = "Failed to update product in database.";
      if (is404) {
        msg = `Backend server (${getBaseURL()}) returned 404 for PUT /product/${editingProduct._id}. The active server does not have the update route. If on local, run 'node server.js'. If on Render, push backend commits to GitHub.`;
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
  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setFeedback(null);

    try {
      let deleteSuccess = false;

      try {
        await axios.delete(`/product/${deletingProduct._id}`);
        deleteSuccess = true;
      } catch (firstErr) {
        try {
          await axios.delete(`/products/${deletingProduct._id}`);
          deleteSuccess = true;
        } catch (secondErr) {
          throw secondErr.response ? secondErr : firstErr;
        }
      }

      if (deleteSuccess) {
        // Remove from list only when MongoDB has permanently deleted it
        setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id));
        setShowDeleteModal(false);
        setFeedback({
          type: "success",
          message: `Product "${deletingProduct.name}" has been permanently deleted from MongoDB database!`
        });
      }
    } catch (err) {
      console.error("Error deleting product from database:", err);
      const is404 = err.response?.status === 404;
      const isNetError = !err.response;

      let msg = "Failed to permanently delete product.";
      if (is404) {
        msg = `Backend (${getBaseURL()}) returned 404 for DELETE /product/${deletingProduct._id}. The active server does not have the DELETE endpoint. If using local backend, ensure 'node server.js' on port 5000 is running. If using Render, commit and push backend changes to GitHub.`;
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
              <i className="bi bi-grid-3x3-gap-fill text-warning"></i>
              Auction Catalog
            </h2>
            <p className="text-secondary small mb-0">
              Manage, edit, or permanently delete items in the live auction catalog.
            </p>
          </div>

          <div className="d-flex gap-2 mt-3 mt-sm-0">
            <Button 
              variant="outline-secondary" 
              className="rounded-3 d-flex align-items-center gap-1 shadow-sm"
              onClick={fetchProducts}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </Button>
            <Link to="/user/products" className="text-decoration-none">
              <Button className="btn-bid-primary d-flex align-items-center gap-1 shadow-sm">
                <i className="bi bi-plus-lg"></i> Add New Product
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
                  placeholder="Search catalog by product name or description..."
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
                Total Products: <strong className="text-dark">{products.length}</strong>
              </span>
              <span className="text-secondary small">
                Showing: <strong className="text-primary">{filteredProducts.length}</strong>
              </span>
            </Col>
          </Row>
        </div>

        {/* Table / Content */}
        {loading ? (
          <div className="text-center py-5 my-5 bg-white rounded-4 border shadow-sm">
            <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            <p className="mt-3 text-secondary fw-semibold">Loading auction catalog...</p>
          </div>
        ) : (
          <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-light border-bottom text-uppercase small text-secondary">
                <tr>
                  <th style={{ width: "60px" }} className="ps-4">#</th>
                  <th style={{ width: "90px" }}>Item</th>
                  <th>Product Details</th>
                  <th>Base Price</th>
                  <th>Auction End Date</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th style={{ width: "220px" }} className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => {
                    const isEnded = product.auctionEndDate && new Date(product.auctionEndDate) < new Date();

                    return (
                      <tr key={product._id || index}>
                        <td className="ps-4 fw-bold text-secondary">{index + 1}</td>
                        <td>
                          <div 
                            className="rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "64px", height: "64px" }}
                          >
                            <img 
                              src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"} 
                              alt={product.name} 
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80";
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold text-dark fs-6">{product.name}</div>
                          <small className="text-secondary text-truncate d-block" style={{ maxWidth: "340px" }}>
                            {product.description || "No description provided"}
                          </small>
                        </td>
                        <td>
                          <span className="fw-bold text-success fs-6">
                            ₹{Number(product.baseBid || 0).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className="small text-dark d-block">
                            {product.auctionEndDate 
                              ? new Date(product.auctionEndDate).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric"
                                })
                              : "N/A"}
                          </span>
                          <small className="text-muted">
                            {product.auctionEndDate 
                              ? new Date(product.auctionEndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                              : ""}
                          </small>
                        </td>
                        <td>
                          {isEnded ? (
                            <Badge bg="secondary" className="px-2 py-1 rounded-pill">
                              <i className="bi bi-check-circle me-1"></i> Ended
                            </Badge>
                          ) : (
                            <span className="badge-live" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>
                              <span className="pulse-dot"></span> Live
                            </span>
                          )}
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-inline-flex gap-2">
                            {/* View / Bid button */}
                            <Link to={`/user/leaderboard/${product._id}`}>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="rounded-3 px-2 py-1"
                                title="View Live Auction Room"
                              >
                                <i className="bi bi-eye"></i> View
                              </Button>
                            </Link>

                            {/* Edit button */}
                            <Button 
                              variant="outline-warning" 
                              size="sm" 
                              className="rounded-3 px-2 py-1 text-dark"
                              onClick={() => handleOpenEdit(product)}
                              title="Edit Product Details"
                            >
                              <i className="bi bi-pencil-square"></i> Edit
                            </Button>

                            {/* Delete button */}
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="rounded-3 px-2 py-1"
                              onClick={() => handleOpenDelete(product)}
                              title="Delete Product Permanently"
                            >
                              <i className="bi bi-trash3"></i> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="py-4">
                        <i className="bi bi-inbox text-muted fs-1 d-block mb-2"></i>
                        <h5 className="fw-bold text-dark">No Products Found</h5>
                        <p className="text-secondary small mb-3">
                          {searchQuery 
                            ? `No auction items matched "${searchQuery}".` 
                            : "There are currently no products listed in the catalog."}
                        </p>
                        {searchQuery ? (
                          <Button size="sm" variant="outline-primary" onClick={() => setSearchQuery("")}>
                            Clear Search
                          </Button>
                        ) : (
                          <Link to="/user/products">
                            <Button size="sm" className="btn-bid-primary">
                              <i className="bi bi-plus-lg me-1"></i> Add First Product
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* ================= EDIT PRODUCT MODAL ================= */}
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
                Edit Auction Product
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-3">
              {editingProduct && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleEditChange}
                      required
                      placeholder="e.g. Vintage Leica Camera"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={editingProduct.description}
                      onChange={handleEditChange}
                      required
                      placeholder="Provide product details..."
                    />
                  </Form.Group>

                  <Row className="g-2 mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small">Base Bid (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          name="baseBid"
                          min="1"
                          value={editingProduct.baseBid}
                          onChange={handleEditChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small">Auction End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="auctionEndDate"
                          value={editingProduct.auctionEndDate}
                          onChange={handleEditChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="image"
                      value={editingProduct.image}
                      onChange={handleEditChange}
                      required
                      placeholder="https://images.unsplash.com/..."
                    />
                    {editingProduct.image && (
                      <div className="mt-2 text-center p-2 border rounded bg-light">
                        <img 
                          src={editingProduct.image} 
                          alt="Preview" 
                          style={{ maxHeight: "120px", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
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

        {/* ================= DELETE CONFIRMATION MODAL ================= */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => !isDeleting && setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton={!isDeleting} className="border-bottom">
            <Modal.Title className="fw-bold fs-5 text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Delete Auction Item Permanently
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <p className="mb-2">
              Are you sure you want to permanently remove this product from the database:
            </p>
            <div className="p-3 bg-light rounded-3 border fw-bold text-dark">
              {deletingProduct?.name}
            </div>
            <small className="text-danger mt-2 d-block">
              <i className="bi bi-info-circle me-1"></i> This will delete the item and all associated bids permanently from MongoDB Atlas. This action cannot be undone.
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

export default AdminAllProducts;
