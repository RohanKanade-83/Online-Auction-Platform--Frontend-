import React, { useState } from 'react';
import { Container, Form, Button, Card, Modal, Alert, Spinner, InputGroup } from 'react-bootstrap';
import axios from "../../api/axios";
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  // Login form state
  const [user, setUser] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'danger', message: '' }

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotData, setForgotData] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [forgotFeedback, setForgotFeedback] = useState(null);

  const handleLoginChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  // Handle User Login
  const loginUser = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setFeedback(null);

    try {
      const res = await axios.post('/login', {
        email: user.email.trim(),
        password: user.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem("userdetail", JSON.stringify(res.data.user));
      
      setFeedback({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => {
        navigate('/user/home');
      }, 700);
    } catch (err) {
      console.error('Login error:', err);
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Invalid email or password. Please try again.'
      });
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Forgot / Reset Password Submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotFeedback(null);

    if (!forgotData.email.trim()) {
      setForgotFeedback({ type: 'danger', message: 'Please enter your registered email address.' });
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setForgotFeedback({ type: 'danger', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotFeedback({ type: 'danger', message: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setResetting(true);

    try {
      let res;
      try {
        res = await axios.post('/forgot-password', {
          email: forgotData.email.trim(),
          newPassword: forgotData.newPassword
        });
      } catch (err1) {
        // Fallback to /reset-password if alternate route
        res = await axios.post('/reset-password', {
          email: forgotData.email.trim(),
          newPassword: forgotData.newPassword
        });
      }

      // Success
      setShowForgotModal(false);
      setUser(prev => ({ ...prev, email: forgotData.email.trim(), password: '' }));
      setForgotData({ email: '', newPassword: '', confirmPassword: '' });
      setFeedback({
        type: 'success',
        message: res.data?.message || 'Password reset successful! Please sign in with your new password.'
      });
    } catch (err) {
      console.error('Reset password error:', err);
      setForgotFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to reset password. Please verify your email and try again.'
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center py-5" 
      style={{ 
        minHeight: 'calc(100vh - 120px)', 
        backgroundColor: '#f8fafc',
        background: 'radial-gradient(ellipse at 50% -10%, rgba(99, 102, 241, 0.1), transparent 70%), #f8fafc' 
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card className="p-4 p-md-5 border-0 shadow-lg rounded-4" style={{ width: '100%', maxWidth: '440px', background: '#ffffff' }}>
          {/* Brand Header */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 shadow-sm"
              style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff'
              }}
            >
              <i className="bi bi-hammer fs-4"></i>
            </div>
            <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
            <p className="text-secondary small mb-0">Sign in to your BidSphere auction account</p>
          </div>

          {/* Alert Notification */}
          {feedback && (
            <Alert 
              variant={feedback.type} 
              dismissible 
              onClose={() => setFeedback(null)}
              className="rounded-3 small"
            >
              {feedback.message}
            </Alert>
          )}

          {/* Login Form */}
          <Form onSubmit={loginUser}>
            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Email Address</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope"></i>
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={user.email}
                  onChange={handleLoginChange}
                  className="border-start-0 ps-0 shadow-none modern-input"
                  required
                />
              </InputGroup>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="fw-semibold small text-secondary mb-0">Password</Form.Label>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none small text-primary fw-semibold"
                  style={{ fontSize: '0.82rem' }}
                  onClick={() => {
                    setForgotData(prev => ({ ...prev, email: user.email }));
                    setForgotFeedback(null);
                    setShowForgotModal(true);
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0 text-muted">
                  <i className="bi bi-lock"></i>
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={user.password}
                  onChange={handleLoginChange}
                  className="border-start-0 border-end-0 ps-0 shadow-none modern-input"
                  required
                />
                <Button 
                  variant="outline-secondary" 
                  className="border-start-0 bg-light text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-100 py-2 btn-bid-primary fw-bold shadow-sm mt-3"
              disabled={loggingIn}
            >
              {loggingIn ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <i className="bi bi-arrow-right ms-1"></i>
                </>
              )}
            </Button>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-secondary small">Don't have an account? </span>
              <Link to="/register" className="text-decoration-none fw-bold text-primary small">
                Register here
              </Link>
            </div>
          </Form>
        </Card>
      </Container>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      <Modal 
        show={showForgotModal} 
        onHide={() => !resetting && setShowForgotModal(false)}
        centered
        backdrop="static"
      >
        <Form onSubmit={handleResetPassword}>
          <Modal.Header closeButton={!resetting} className="border-bottom">
            <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
              <i className="bi bi-key-fill text-warning"></i>
              Reset Your Password
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <p className="text-secondary small mb-3">
              Enter your registered account email and choose a new password. Your password will be updated immediately.
            </p>

            {forgotFeedback && (
              <Alert 
                variant={forgotFeedback.type} 
                dismissible 
                onClose={() => setForgotFeedback(null)}
                className="py-2 small"
              >
                {forgotFeedback.message}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Registered Email Address</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light text-muted">
                  <i className="bi bi-envelope"></i>
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">New Password (min 6 chars)</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light text-muted">
                  <i className="bi bi-lock"></i>
                </InputGroup.Text>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  minLength="6"
                  required
                />
                <Button 
                  variant="outline-secondary" 
                  className="bg-light text-muted"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Confirm New Password</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light text-muted">
                  <i className="bi bi-shield-lock"></i>
                </InputGroup.Text>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={forgotData.confirmPassword}
                  onChange={handleForgotChange}
                  minLength="6"
                  required
                />
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowForgotModal(false)}
              disabled={resetting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-bid-primary"
              disabled={resetting}
            >
              {resetting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1"></i> Update Password
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
