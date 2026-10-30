import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, Link } from 'react-router-dom';
import { Card, Form, Button, Container, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';

const Leaderboard = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'danger', message: '' }
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  const userinfo = (() => {
    try {
      return JSON.parse(localStorage.getItem('userdetail'));
    } catch {
      return null;
    }
  })();
  const userId = userinfo?.id;

  const fetchData = async () => {
    try {
      const prod = await axios.get(`/productbyid/${productId}`);
      setProduct(prod.data || {});

      const bidRes = await axios.get(`/bids/${productId}`);
      setBids(Array.isArray(bidRes.data) ? bidRes.data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading leaderboard data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  // Live countdown timer
  useEffect(() => {
    if (!product?.auctionEndDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(product.auctionEndDate);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('Auction Ended');
        setIsEnded(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
        setIsEnded(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product?.auctionEndDate]);

  const highestBidAmount = bids.length > 0 ? bids[0]?.amount : (product.baseBid || 0);
  const minRequiredBid = highestBidAmount + 1;

  const handleQuickAdd = (increment) => {
    const currentBase = Number(newBid) || highestBidAmount;
    setNewBid(String(currentBase + increment));
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setFeedback({ type: 'warning', message: 'Please sign in to place a bid on this item.' });
      return;
    }

    const bidVal = Number(newBid);
    if (bidVal <= highestBidAmount) {
      setFeedback({
        type: 'danger',
        message: `Your bid must be higher than ₹${highestBidAmount.toLocaleString()}. Minimum allowed is ₹${minRequiredBid.toLocaleString()}.`
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      await axios.post('/bid', {
        productId: productId,
        user: userId,
        amount: bidVal
      });

      const bidRes = await axios.get(`/bids/${productId}`);
      setBids(Array.isArray(bidRes.data) ? bidRes.data : []);
      setNewBid('');
      setFeedback({
        type: 'success',
        message: `🎉 Success! Your bid of ₹${bidVal.toLocaleString()} has been placed as the highest bid!`
      });
    } catch (err) {
      console.error('Error placing bid:', err);
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to place bid. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isUserWinning = bids.length > 0 && (bids[0]?.user?._id === userId || bids[0]?.user === userId);

  if (loading) {
    return (
      <Container className="py-5 text-center my-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-secondary fw-semibold">Loading auction room and leaderboard...</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 120px)' }} className="py-4">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
          <Link to="/user/home" className="text-secondary text-decoration-none">
            <i className="bi bi-house me-1"></i> Home
          </Link>
          <span>/</span>
          <Link to="/user/home" className="text-secondary text-decoration-none">Live Auctions</Link>
          <span>/</span>
          <span className="text-dark fw-semibold text-truncate" style={{ maxWidth: '240px' }}>
            {product.name || 'Auction Details'}
          </span>
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

        <Row className="g-4 mb-4">
          {/* Left Column: Product Showcase */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <div className="position-relative bg-light" style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"}
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'contain', padding: '16px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Status Badge */}
                <div className="position-absolute top-0 start-0 m-3">
                  {isEnded ? (
                    <span className="badge bg-secondary px-3 py-2 rounded-pill fw-bold">
                      <i className="bi bi-flag-fill me-1"></i> AUCTION CLOSED
                    </span>
                  ) : (
                    <span className="badge-live">
                      <span className="pulse-dot"></span> LIVE BIDDING
                    </span>
                  )}
                </div>

                {/* Countdown Badge */}
                <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-75 text-white d-flex justify-content-between align-items-center" style={{ backdropFilter: 'blur(8px)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-clock-history text-warning fs-5"></i>
                    <div>
                      <small className="d-block text-secondary" style={{ fontSize: '0.72rem' }}>TIME REMAINING</small>
                      <span className="fw-bold fs-6">{timeLeft || 'Calculating...'}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <small className="d-block text-secondary" style={{ fontSize: '0.72rem' }}>TOTAL BIDS</small>
                    <span className="badge bg-primary rounded-pill px-3 py-1 fw-bold fs-6">
                      {bids.length}
                    </span>
                  </div>
                </div>
              </div>

              <Card.Body className="p-4">
                <h3 className="fw-bold text-dark mb-2">{product.name}</h3>
                <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                  {product.description || "Authentic item listed for auction. All bids are binding."}
                </p>

                <div className="pt-3 border-top d-flex flex-wrap gap-4 text-muted small">
                  <div>
                    <span className="d-block text-secondary">Starting Base Bid</span>
                    <strong className="text-dark fs-6">₹{Number(product.baseBid || 0).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="d-block text-secondary">Ends On</span>
                    <strong className="text-dark">
                      {product.auctionEndDate ? new Date(product.auctionEndDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="d-block text-secondary">Buyer Protection</span>
                    <strong className="text-success">
                      <i className="bi bi-shield-check me-1"></i> Verified Escrow
                    </strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Bidding Command Center */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Highest Bid Banner */}
                <div 
                  className="p-4 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm"
                  style={{
                    background: isUserWinning 
                      ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                      : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-white text-dark fw-bold px-3 py-1 rounded-pill small">
                      {bids.length > 0 ? '🏆 CURRENT HIGHEST BID' : '🏷️ STARTING PRICE'}
                    </span>
                    {isUserWinning && (
                      <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill small">
                        🌟 YOU ARE HIGHEST BIDDER
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-baseline gap-2 my-2">
                    <h1 className="display-4 fw-bold mb-0 text-white">
                      ₹{highestBidAmount.toLocaleString()}
                    </h1>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-white border-opacity-25 small">
                    <span>
                      {bids[0]?.user?.name 
                        ? `Led by ${bids[0]?.user?.name}`
                        : 'No bids placed yet. Be the first!'}
                    </span>
                    <span>
                      Min. next bid: <strong>₹{minRequiredBid.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Bidding Form */}
                {!isEnded ? (
                  <Form onSubmit={handleBidSubmit}>
                    <Form.Group className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="fw-bold text-dark mb-0">
                          Your Bid Amount (₹)
                        </Form.Label>
                        <small className="text-muted">
                          Must be &gt; ₹{highestBidAmount.toLocaleString()}
                        </small>
                      </div>

                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-end-0 fw-bold text-dark">
                          ₹
                        </span>
                        <Form.Control
                          type="number"
                          min={minRequiredBid}
                          placeholder={`Enter at least ${minRequiredBid}`}
                          value={newBid}
                          onChange={(e) => setNewBid(e.target.value)}
                          className="border-start-0 ps-1 fw-bold fs-5 shadow-none"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </Form.Group>

                    {/* Quick increment chips */}
                    <div className="mb-4">
                      <small className="text-secondary d-block mb-2 fw-semibold">Quick Increments:</small>
                      <div className="d-flex flex-wrap gap-2">
                        {[100, 500, 1000, 5000].map((inc) => (
                          <button
                            key={inc}
                            type="button"
                            className="quick-chip"
                            onClick={() => handleQuickAdd(inc)}
                            disabled={submitting}
                          >
                            +₹{inc.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || !userId}
                      className="w-100 py-3 btn-bid-primary fs-5 fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Spinner size="sm" animation="border" /> Submitting Bid...
                        </>
                      ) : !userId ? (
                        <>
                          <i className="bi bi-lock-fill"></i> Sign In to Place Bid
                        </>
                      ) : (
                        <>
                          <i className="bi bi-hammer"></i> Place Bid Now
                        </>
                      )}
                    </Button>

                    {!userId && (
                      <p className="text-center small text-muted mt-2">
                        You need an account to bid. <Link to="/login">Sign in here</Link>
                      </p>
                    )}
                  </Form>
                ) : (
                  <div className="p-4 rounded-4 bg-light border text-center">
                    <i className="bi bi-trophy text-warning fs-1 d-block mb-2"></i>
                    <h5 className="fw-bold text-dark">This Auction Has Concluded</h5>
                    <p className="text-secondary small mb-0">
                      {bids[0]?.user?.name ? (
                        <>Winning bid: <strong>₹{bids[0]?.amount.toLocaleString()}</strong> by <strong>{bids[0]?.user?.name}</strong></>
                      ) : (
                        "No bids were placed before the auction concluded."
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Guarantees Footer */}
              <div className="pt-3 border-top mt-4 text-center text-muted small d-flex justify-content-around">
                <span><i className="bi bi-lightning-charge text-warning me-1"></i> Instant Confirmation</span>
                <span><i className="bi bi-shield-check text-success me-1"></i> Verified Bidder</span>
                <span><i className="bi bi-arrow-repeat text-primary me-1"></i> Live Sync</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Live Leaderboard / Bid History Section */}
        <Card className="border-0 shadow-sm rounded-4 p-4 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div>
              <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-trophy text-warning"></i>
                Leaderboard & Bid History
              </h4>
              <small className="text-muted">Real-time descending ranking of all submissions</small>
            </div>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="rounded-pill px-3"
              onClick={fetchData}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </Button>
          </div>

          {bids.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {bids.map((bid, index) => {
                const isTopBid = index === 0;
                const isCurrentUserBid = bid.user?._id === userId || bid.user === userId;

                let rankBadge = (
                  <span className="badge rounded-circle bg-light text-secondary border d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                    #{index + 1}
                  </span>
                );

                if (index === 0) {
                  rankBadge = (
                    <span className="badge rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '1rem' }} title="Top Leader">
                      🥇
                    </span>
                  );
                } else if (index === 1) {
                  rankBadge = (
                    <span className="badge rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                      🥈
                    </span>
                  );
                } else if (index === 2) {
                  rankBadge = (
                    <span className="badge rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                      🥉
                    </span>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-4 d-flex flex-wrap align-items-center justify-content-between transition-all ${
                      isTopBid 
                        ? 'bg-warning-subtle border border-warning' 
                        : isCurrentUserBid 
                          ? 'bg-primary-subtle border border-primary' 
                          : 'bg-white border'
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {rankBadge}
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <strong className="text-dark">
                            {bid.user?.name || `Bidder #${index + 1}`}
                          </strong>
                          {isTopBid && (
                            <span className="badge bg-warning text-dark fw-bold small">
                              Highest Bidder
                            </span>
                          )}
                          {isCurrentUserBid && (
                            <span className="badge bg-primary text-white fw-bold small">
                              You
                            </span>
                          )}
                        </div>
                        <small className="text-secondary">
                          <i className="bi bi-clock me-1"></i>
                          {bid.timestamp ? new Date(bid.timestamp).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) : 'Just now'}
                        </small>
                      </div>
                    </div>

                    <div className="text-end mt-2 mt-sm-0">
                      <span className="fs-5 fw-bold text-success">
                        ₹{Number(bid.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-dots text-muted fs-1 d-block mb-2"></i>
              <h5 className="fw-bold text-dark">No Bids Yet</h5>
              <p className="text-secondary small mb-0">Be the first to step up and place a bid!</p>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Leaderboard;
