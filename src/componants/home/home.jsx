import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Form, Badge, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "../../api/axios";
import './home.css';

export default function HomePage() {
  const [auctionItems, setAuctionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, ending-soon
  const [sortBy, setSortBy] = useState('ending-soonest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/allproducts');
        setAuctionItems(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format remaining time
  const getTimeRemaining = (endDateString) => {
    if (!endDateString) return { text: 'Ongoing', isEnded: false };
    const diff = new Date(endDateString) - new Date();
    if (diff <= 0) return { text: 'Auction Ended', isEnded: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return { text: `${days}d ${hours}h left`, isEnded: false };
    if (hours > 0) return { text: `${hours}h ${minutes}m left`, isEnded: false };
    return { text: `${minutes}m left`, isEnded: false };
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return auctionItems
      .filter((item) => {
        const matchesSearch = 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        const { isEnded } = getTimeRemaining(item.auctionEndDate);
        if (filterType === 'active') return !isEnded;
        if (filterType === 'ended') return isEnded;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.baseBid || 0) - (b.baseBid || 0);
        if (sortBy === 'price-high') return (b.baseBid || 0) - (a.baseBid || 0);
        if (sortBy === 'ending-soonest') {
          return new Date(a.auctionEndDate || 0) - new Date(b.auctionEndDate || 0);
        }
        return 0;
      });
  }, [auctionItems, searchQuery, filterType, sortBy]);

  return (
    <div className="home-page-container pb-5">
      {/* Banner / Hero Section */}
      <div className="home-hero-banner py-5 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 bg-white text-primary border shadow-sm">
                <span className="pulse-dot"></span>
                <span className="small fw-bold">LIVE AUCTION DASHBOARD</span>
              </div>
              <h1 className="display-5 fw-bold text-dark mb-2">
                Discover, Bid & Win Exclusive Items
              </h1>
              <p className="text-secondary fs-6 mb-3" style={{ maxWidth: '620px' }}>
                Join live bidding rooms, compete in real-time leaderboards, or list your own authentic collectibles for auction today.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/user/products">
                  <Button className="btn-bid-primary py-2 px-3 fw-semibold">
                    <i className="bi bi-plus-circle me-1"></i> List New Auction
                  </Button>
                </Link>
                <Link to="/user/contests">
                  <Button className="btn-bid-outline py-2 px-3">
                    <i className="bi bi-grid me-1"></i> Browse All Catalogs
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={4} className="d-none d-lg-block text-end">
              <div className="p-3 bg-white rounded-4 shadow-sm border d-inline-block text-start">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="rounded-3 p-2 bg-primary-subtle text-primary fs-4">
                    <i className="bi bi-hammer"></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">{auctionItems.length} Products</h5>
                    <small className="text-muted">Currently in catalog</small>
                  </div>
                </div>
                <div className="small text-secondary pt-2 border-top">
                  <i className="bi bi-check-circle-fill text-success me-1"></i> Real-time bidding enabled
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Search, Filter & Controls Bar */}
        <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
          <Row className="g-3 align-items-center">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search live auctions by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-start-0 ps-0 shadow-none"
                />
                {searchQuery && (
                  <Button 
                    variant="link" 
                    className="text-muted text-decoration-none border-start-0 border"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>

            <Col md={4} sm={6}>
              <div className="d-flex gap-1">
                <Button
                  size="sm"
                  variant={filterType === 'all' ? 'primary' : 'outline-secondary'}
                  className="rounded-pill px-3 fw-semibold"
                  onClick={() => setFilterType('all')}
                >
                  All ({auctionItems.length})
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'active' ? 'primary' : 'outline-secondary'}
                  className="rounded-pill px-3 fw-semibold"
                  onClick={() => setFilterType('active')}
                >
                  Active
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'ended' ? 'primary' : 'outline-secondary'}
                  className="rounded-pill px-3 fw-semibold"
                  onClick={() => setFilterType('ended')}
                >
                  Ended
                </Button>
              </div>
            </Col>

            <Col md={3} sm={6} className="text-md-end">
              <Form.Select 
                size="sm" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="shadow-none rounded-3"
              >
                <option value="ending-soonest">⏳ Ending Soonest</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Product Grid Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-fire text-danger"></i>
            Live Auctions
            <Badge bg="secondary" className="ms-1 fw-normal fs-6">
              {filteredProducts.length} items
            </Badge>
          </h4>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5 my-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-secondary fw-semibold">Loading live auction catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <Row className="g-4">
            {filteredProducts.map((item) => {
              const { text: timeText, isEnded } = getTimeRemaining(item.auctionEndDate);

              return (
                <Col md={6} lg={4} key={item._id}>
                  <Card className="auction-card h-100 border-0 shadow-sm">
                    {/* Image & Status Badges */}
                    <div className="auction-img-wrapper position-relative">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
                        }}
                      />

                      {/* Top Badges */}
                      <div className="position-absolute top-0 start-0 m-3">
                        {isEnded ? (
                          <span className="badge bg-secondary px-2 py-1 rounded-pill small">
                            <i className="bi bi-check2-circle me-1"></i> COMPLETED
                          </span>
                        ) : (
                          <span className="badge-live">
                            <span className="pulse-dot"></span> LIVE
                          </span>
                        )}
                      </div>

                      <div className="position-absolute top-0 end-0 m-3">
                        <span 
                          className={`badge rounded-pill px-2 py-1 shadow-sm ${
                            isEnded ? 'bg-dark text-muted' : 'bg-dark bg-opacity-75 text-white'
                          }`}
                          style={{ backdropFilter: 'blur(4px)' }}
                        >
                          <i className="bi bi-clock me-1 text-warning"></i>
                          {timeText}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <Card.Body className="d-flex flex-column justify-content-between p-4">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <Card.Title className="fw-bold text-dark fs-5 mb-0 text-truncate" title={item.name}>
                            {item.name}
                          </Card.Title>
                        </div>

                        <p className="text-secondary small mb-3 text-truncate-2" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '38px',
                          lineHeight: '1.4'
                        }}>
                          {item.description || "Authentic verified item available for real-time community bidding."}
                        </p>

                        {/* Bid Details Box */}
                        <div className="p-3 rounded-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                Starting Base Price
                              </small>
                              <span className="fw-bold text-dark fs-6">
                                ₹{Number(item.baseBid || 0).toLocaleString()}
                              </span>
                            </div>

                            <div className="text-end">
                              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                Highest Bid
                              </small>
                              <span className="fw-bold text-success fs-5">
                                ₹{Number(item.highestBid || item.baseBid || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link to={`/user/leaderboard/${item._id}`} className="text-decoration-none">
                        <Button 
                          className={`w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                            isEnded ? 'btn-secondary disabled' : 'btn-bid-primary'
                          }`}
                        >
                          {isEnded ? (
                            <>View Final Leaderboard <i className="bi bi-trophy"></i></>
                          ) : (
                            <>Join Bidding Room <i className="bi bi-arrow-right"></i></>
                          )}
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          /* Empty State */
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4 p-5">
            <div className="rounded-circle bg-light d-inline-flex p-4 mb-3 text-secondary fs-1">
              <i className="bi bi-inbox"></i>
            </div>
            <h4 className="fw-bold text-dark">No Auction Items Found</h4>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '400px' }}>
              {searchQuery 
                ? `No products matched "${searchQuery}". Try adjusting your search or filters.`
                : 'There are currently no items in this section. Be the first to list a product for auction!'}
            </p>
            {searchQuery ? (
              <Button variant="outline-primary" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </Button>
            ) : (
              <Link to="/user/products">
                <Button className="btn-bid-primary px-4 py-2">
                  <i className="bi bi-plus-lg me-1"></i> Create First Auction
                </Button>
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
