import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './footer.css';

function FooterComponent() {
  return (
    <footer className="bidsphere-footer">
      <Container>
        <Row className="gy-4">
          {/* Brand Info */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-hammer text-white fs-6"></i>
              </div>
              <span className="brand-name text-white fs-4">
                Bid<span className="brand-accent">Sphere</span>
              </span>
            </div>
            <p className="text-secondary small mb-4" style={{ lineHeight: '1.7', maxWidth: '340px' }}>
              The modern marketplace for live, real-time product auctions. Designed for transparent bidding, authentic items, and seamless transactions.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a href="#twitter" className="footer-social-link"><i className="bi bi-twitter-x"></i></a>
              <a href="#github" className="footer-social-link"><i className="bi bi-github"></i></a>
              <a href="#linkedin" className="footer-social-link"><i className="bi bi-linkedin"></i></a>
              <a href="#discord" className="footer-social-link"><i className="bi bi-discord"></i></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} xs={6}>
            <h6 className="text-white fw-bold mb-3 text-uppercase small tracking-wider">Explore</h6>
            <ul className="list-unstyled footer-nav-list">
              <li><Link to="/user/home">Live Auctions</Link></li>
              <li><Link to="/user/products">Sell an Item</Link></li>
              <li><Link to="/user/contests">All Catalogs</Link></li>
              <li><Link to="/user/cart">Community</Link></li>
            </ul>
          </Col>

          {/* Platform */}
          <Col lg={2} md={6} xs={6}>
            <h6 className="text-white fw-bold mb-3 text-uppercase small tracking-wider">Platform</h6>
            <ul className="list-unstyled footer-nav-list">
              <li><Link to="/admin">Admin Portal</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><a href="#terms">Auction Rules</a></li>
            </ul>
          </Col>

          {/* Security & Badges */}
          <Col lg={4} md={6}>
            <h6 className="text-white fw-bold mb-3 text-uppercase small tracking-wider">Buyer Protection</h6>
            <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="d-flex align-items-center gap-3 mb-2">
                <i className="bi bi-shield-lock-fill text-success fs-4"></i>
                <div>
                  <h6 className="text-white mb-0 small fw-bold">100% Verified Escrow</h6>
                  <small className="text-secondary" style={{ fontSize: '0.78rem' }}>Bids and transactions backed with end-to-end security.</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <i className="bi bi-clock-history text-warning fs-4"></i>
                <div>
                  <h6 className="text-white mb-0 small fw-bold">Real-Time Timestamped</h6>
                  <small className="text-secondary" style={{ fontSize: '0.78rem' }}>Millisecond precision bid ordering and tracking.</small>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center small text-secondary">
          <p className="mb-0">© {new Date().getFullYear()} BidSphere Inc. All rights reserved.</p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <a href="#privacy" className="text-secondary text-decoration-none hover-white">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="text-secondary text-decoration-none hover-white">Terms of Service</a>
            <span>•</span>
            <a href="#support" className="text-secondary text-decoration-none hover-white">Support Center</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default FooterComponent;
