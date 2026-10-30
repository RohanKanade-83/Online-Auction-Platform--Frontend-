import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const PublicNavbar = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="public-navbar sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <div className="brand-icon-box">
            <i className="bi bi-hammer text-white fs-5"></i>
          </div>
          <span className="brand-name">
            Bid<span className="brand-accent">Sphere</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="public-nav" className="border-0 shadow-none">
          <i className="bi bi-list text-light fs-2"></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="public-nav">
          <Nav className="mx-auto align-items-lg-center">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
            >
              <i className="bi bi-house me-1"></i> Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/user/home" 
              className={`nav-link-custom ${location.pathname.startsWith('/user/home') ? 'active' : ''}`}
            >
              <i className="bi bi-broadcast me-1 text-danger"></i> Live Auctions
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className={`nav-link-custom ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <i className="bi bi-shield-lock me-1"></i> Admin Portal
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <Link to="/login" className="text-decoration-none">
              <button className="btn btn-nav-login">
                <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
              </button>
            </Link>
            <Link to="/register" className="text-decoration-none">
              <button className="btn btn-nav-register">
                Get Started <i className="bi bi-arrow-right-short"></i>
              </button>
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default PublicNavbar;
