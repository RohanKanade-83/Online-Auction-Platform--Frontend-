import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userdetail');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userdetail');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Navbar expand="lg" className="user-navbar sticky-top bg-white border-bottom shadow-sm py-2">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/user/home" className="d-flex align-items-center gap-2">
          <div className="brand-icon-box" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-hammer text-white fs-6"></i>
          </div>
          <span className="brand-name text-dark fs-4">
            Bid<span className="brand-accent">Sphere</span>
          </span>
          <span className="badge bg-light text-primary border ms-1 fw-semibold small">
            Live Room
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="user-navbar-nav" className="border-0 shadow-none">
          <i className="bi bi-list fs-2 text-dark"></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="user-navbar-nav">
          {/* Main Navigation Links */}
          <Nav className="mx-auto align-items-lg-center">
            <Nav.Link 
              as={Link} 
              to="/user/home"
              className={`px-3 py-2 rounded-3 text-secondary fw-semibold transition-all ${
                location.pathname === '/user/home' ? 'text-primary bg-primary-subtle' : ''
              }`}
            >
              <i className="bi bi-broadcast me-1 text-danger"></i> Live Auctions
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/user/products"
              className={`px-3 py-2 rounded-3 text-secondary fw-semibold transition-all ${
                location.pathname === '/user/products' ? 'text-primary bg-primary-subtle' : ''
              }`}
            >
              <i className="bi bi-plus-circle me-1 text-success"></i> Add Product
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/user/contests"
              className={`px-3 py-2 rounded-3 text-secondary fw-semibold transition-all ${
                location.pathname === '/user/contests' ? 'text-primary bg-primary-subtle' : ''
              }`}
            >
              <i className="bi bi-grid-3x3-gap me-1 text-warning"></i> Catalog
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/user/cart"
              className={`px-3 py-2 rounded-3 text-secondary fw-semibold transition-all ${
                location.pathname === '/user/cart' ? 'text-primary bg-primary-subtle' : ''
              }`}
            >
              <i className="bi bi-people me-1 text-info"></i> Community
            </Nav.Link>
          </Nav>

          {/* Right actions: User Profile & Logout */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <NavDropdown
              align="end"
              title={
                <div className="d-inline-flex align-items-center gap-2 text-dark">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {getInitials(currentUser?.name)}
                  </div>
                  <div className="text-start d-none d-md-block">
                    <div className="fw-bold small text-truncate" style={{ maxWidth: '120px' }}>
                      {currentUser?.name || 'Active Bidder'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Verified Member
                    </div>
                  </div>
                  <i className="bi bi-chevron-down text-muted small ms-1"></i>
                </div>
              }
              id="user-profile-dropdown"
              className="user-dropdown-custom"
            >
              <div className="px-3 py-2 border-bottom">
                <p className="mb-0 fw-bold">{currentUser?.name || 'Bidder'}</p>
                <small className="text-muted">{currentUser?.email || 'Logged In'}</small>
              </div>

              <NavDropdown.Item as={Link} to="/user/home" className="py-2">
                <i className="bi bi-house-door me-2 text-primary"></i> Dashboard Home
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/user/products" className="py-2">
                <i className="bi bi-tag me-2 text-success"></i> Sell an Item
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/user/contests" className="py-2">
                <i className="bi bi-clock-history me-2 text-warning"></i> Auction Catalog
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item onClick={handleLogout} className="py-2 text-danger fw-semibold">
                <i className="bi bi-box-arrow-right me-2"></i> Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
