import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from './footer/footer';

const LandingPage = () => {
  const sampleLiveItems = [
    {
      title: "Rolex Submariner Date 41mm",
      category: "Luxury Watches",
      currentBid: 940000,
      bidsCount: 28,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
      timeLeft: "02h 45m"
    },
    {
      title: "1967 Vintage Leica M4 Camera",
      category: "Photography & Optics",
      currentBid: 285000,
      bidsCount: 19,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80",
      timeLeft: "05h 12m"
    },
    {
      title: "Rare Cyberpunk Digital Sculpture #042",
      category: "Digital Arts & NFTs",
      currentBid: 145000,
      bidsCount: 34,
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=700&q=80",
      timeLeft: "01h 18m"
    }
  ];

  const features = [
    {
      icon: "bi-lightning-charge-fill",
      color: "#f59e0b",
      title: "Real-Time Bidding",
      desc: "Instant live updates with zero lag. Never miss a winning bid with automated leaderboard tracking."
    },
    {
      icon: "bi-shield-check",
      color: "#10b981",
      title: "Verified Authenticity",
      desc: "Every auction item undergoes strict validation by certified appraisers before going live."
    },
    {
      icon: "bi-wallet2",
      color: "#6366f1",
      title: "Bank-Grade Security",
      desc: "Enterprise encrypted transactions ensuring smooth deposits, holds, and transparent payouts."
    },
    {
      icon: "bi-trophy-fill",
      color: "#ec4899",
      title: "Transparent Leaderboards",
      desc: "Full visibility into bidding history, timestamps, and rival bids with 100% cryptographic integrity."
    }
  ];

  return (
    <div style={{ backgroundColor: "#0b0f19", color: "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Hero Section */}
      <section className="position-relative py-5 py-lg-6" style={{
        background: "radial-gradient(ellipse at 50% -20%, rgba(99, 102, 241, 0.25), transparent 70%), #0b0f19"
      }}>
        <Container className="py-4">
          <Row className="align-items-center gy-5">
            <Col lg={7} className="text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}>
                <span className="pulse-dot"></span>
                <span className="text-white small fw-bold tracking-wide">
                  LIVE AUCTION PLATFORM 2.0
                </span>
                <Badge bg="warning" text="dark" className="ms-1 fw-bold">NEW</Badge>
              </div>

              <h1 className="display-3 fw-bold mb-3 tracking-tight" style={{
                lineHeight: "1.15",
                background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Bid Smarter. Win Faster. <br />
                <span style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Exclusive Real-Time Auctions.
                </span>
              </h1>

              <p className="lead text-secondary mb-4 fs-5" style={{ maxWidth: "580px", color: "#94a3b8 !important" }}>
                Experience lightning-fast auctions with verified items, zero hidden fees, and transparent real-time bidding for collectors, creators, and enthusiasts.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-5">
                <Link to="/user/home" className="text-decoration-none">
                  <Button className="btn-bid-gold px-4 py-3 fs-6 d-inline-flex align-items-center gap-2">
                    <i className="bi bi-broadcast text-danger fs-5"></i> Explore Live Bids
                  </Button>
                </Link>

                <Link to="/register" className="text-decoration-none">
                  <Button className="btn-bid-outline text-white px-4 py-3 fs-6" style={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.05)"
                  }}>
                    Create Account <i className="bi bi-chevron-right ms-1"></i>
                  </Button>
                </Link>
              </div>

              {/* Stats Counters */}
              <Row className="pt-3 border-top g-4" style={{ borderColor: "rgba(255, 255, 255, 0.1) !important" }}>
                <Col xs={4}>
                  <h3 className="fw-bold mb-0 text-white">₹5.2 Cr+</h3>
                  <small className="text-muted">Total Bids Value</small>
                </Col>
                <Col xs={4}>
                  <h3 className="fw-bold mb-0 text-white">18,500+</h3>
                  <small className="text-muted">Active Bidders</small>
                </Col>
                <Col xs={4}>
                  <h3 className="fw-bold mb-0 text-white">99.98%</h3>
                  <small className="text-muted">Success Rate</small>
                </Col>
              </Row>
            </Col>

            {/* Hero Right Visual Showcase */}
            <Col lg={5}>
              <div className="position-relative mx-auto" style={{ maxWidth: "440px" }}>
                {/* Glow Backdrop */}
                <div className="position-absolute w-100 h-100 rounded-5" style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(245, 158, 11, 0.2))",
                  filter: "blur(40px)",
                  zIndex: 0
                }}></div>

                {/* Featured Card */}
                <div className="position-relative rounded-4 p-4 shadow-2xl" style={{
                  background: "rgba(17, 24, 39, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  zIndex: 1
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge-live">
                      <span className="pulse-dot"></span> LIVE AUCTION
                    </span>
                    <span className="text-muted small">
                      <i className="bi bi-clock-history me-1 text-warning"></i> Ends in <strong>14m 22s</strong>
                    </span>
                  </div>

                  <div className="rounded-3 overflow-hidden mb-3" style={{ height: "240px" }}>
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                      alt="Featured Watch"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold text-white mb-0">Minimalist Chronograph Series 01</h5>
                      <small className="text-secondary">Official Limited Edition 1 of 50</small>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 my-3" style={{
                    background: "rgba(31, 41, 55, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted d-block">Current Highest Bid</small>
                        <span className="fs-4 fw-bold text-warning">₹1,85,000</span>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">Top Contender</small>
                        <span className="fw-semibold text-white">
                          <i className="bi bi-person-circle text-primary me-1"></i> R. Kanade
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to="/user/home" className="w-100 text-decoration-none">
                    <Button className="btn-bid-primary w-100 py-2 fw-bold">
                      Enter Auction Room <i className="bi bi-arrow-right ms-1"></i>
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Live Auctions Carousel/Teaser Section */}
      <section className="py-5" style={{ backgroundColor: "#0f172a" }}>
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <div className="d-inline-flex align-items-center gap-2 mb-2 text-warning fw-bold small text-uppercase">
                <i className="bi bi-fire"></i> Hot Auctions Today
              </div>
              <h2 className="fw-bold text-white mb-0">Trending Live Listings</h2>
            </div>
            <Link to="/user/home" className="text-warning text-decoration-none fw-semibold">
              View All Live Items <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <Row className="g-4">
            {sampleLiveItems.map((item, idx) => (
              <Col md={4} key={idx}>
                <div className="rounded-4 overflow-hidden h-100 d-flex flex-direction-column justify-content-between p-3" style={{
                  background: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "transform 0.3s ease, border-color 0.3s ease"
                }}>
                  <div>
                    <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: "200px" }}>
                      <img src={item.image} alt={item.title} className="w-100 h-100" style={{ objectFit: "cover" }} />
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge-live">
                          <span className="pulse-dot"></span> LIVE
                        </span>
                      </div>
                      <div className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-semibold text-white" style={{
                        background: "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(4px)"
                      }}>
                        <i className="bi bi-clock me-1 text-warning"></i> {item.timeLeft}
                      </div>
                    </div>

                    <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: "0.75rem" }}>
                      {item.category}
                    </small>
                    <h5 className="fw-bold text-white mt-1 mb-3 text-truncate">{item.title}</h5>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Current Bid</small>
                        <span className="fw-bold text-warning fs-5">₹{item.currentBid.toLocaleString()}</span>
                      </div>
                      <Link to="/user/home">
                        <Button size="sm" className="btn-bid-primary py-2 px-3 fw-bold">
                          Join Bid
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-5 py-lg-6" style={{ backgroundColor: "#0b0f19" }}>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-bold text-uppercase small">
              Why BidSphere
            </span>
            <h2 className="display-5 fw-bold text-white mt-3">The New Standard in Online Auctions</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "600px" }}>
              Engineered for absolute transparency, speed, and fairness. Designed for collectors, sellers, and everyday bidders.
            </p>
          </div>

          <Row className="g-4">
            {features.map((feat, idx) => (
              <Col md={6} lg={3} key={idx}>
                <div className="p-4 rounded-4 h-100" style={{
                  background: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s ease"
                }}>
                  <div className="d-flex align-items-center justify-content-center rounded-3 mb-3" style={{
                    width: "52px",
                    height: "52px",
                    background: `${feat.color}20`,
                    color: feat.color,
                    fontSize: "1.5rem"
                  }}>
                    <i className={`bi ${feat.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-white mb-2">{feat.title}</h5>
                  <p className="text-secondary small mb-0" style={{ lineHeight: "1.6" }}>{feat.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5" style={{ backgroundColor: "#111827" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white">How Bidding Works</h2>
            <p className="text-secondary">Three effortless steps to start participating in real-time auctions.</p>
          </div>

          <Row className="g-4 text-center">
            <Col md={4}>
              <div className="p-4 rounded-4 h-100" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white fs-4" style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                }}>
                  1
                </div>
                <h5 className="fw-bold text-white">Sign In or Register</h5>
                <p className="text-secondary small">
                  Create your verified account in 30 seconds and access all active live bidding rooms.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 rounded-4 h-100" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white fs-4" style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                }}>
                  2
                </div>
                <h5 className="fw-bold text-white">Place Live Bids</h5>
                <p className="text-secondary small">
                  Monitor real-time outbids on the dynamic leaderboard and submit custom or quick-increment bids.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 rounded-4 h-100" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white fs-4" style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #34d399 0%, #059669 100%)"
                }}>
                  3
                </div>
                <h5 className="fw-bold text-white">Win & Claim Item</h5>
                <p className="text-secondary small">
                  When timer concludes, the top bidder claims victory with transparent transaction confirmation.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Final CTA Banner */}
      <section className="py-5" style={{
        background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.2), transparent 70%), #0b0f19"
      }}>
        <Container>
          <div className="p-5 rounded-5 text-center position-relative overflow-hidden shadow-2xl" style={{
            background: "linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.95))",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}>
            <h2 className="display-5 fw-bold text-white mb-3">Ready to Join Your First Live Bid?</h2>
            <p className="text-secondary fs-5 mx-auto mb-4" style={{ maxWidth: "600px" }}>
              Explore active listings right now or create your own auction in minutes.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/user/home">
                <Button className="btn-bid-gold px-4 py-3 fw-bold fs-6">
                  <i className="bi bi-broadcast me-2"></i> Join Live Auctions
                </Button>
              </Link>
              <Link to="/login">
                <Button className="btn-bid-outline text-white px-4 py-3 fw-bold fs-6" style={{
                  borderColor: "rgba(255, 255, 255, 0.25)"
                }}>
                  Sign In to Bid
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
