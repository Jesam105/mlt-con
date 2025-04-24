import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { Mail, Package, Calendar, MapPin, User, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { letters, carePackages } = useMessages();
  const navigate = useNavigate();
  
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Filter messages for the current user
  const myLetters = letters.filter(letter => 
    letter.recipientId === currentUser?.id || letter.senderId === currentUser?.id);
  
  const myCarePackages = carePackages.filter(pkg => 
    pkg.recipientId === currentUser?.id || pkg.senderId === currentUser?.id);
  
  // Count unread messages
  const unreadLetters = myLetters.filter(letter => 
    letter.recipientId === currentUser?.id && !letter.isRead).length;
  
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">Good Day, {currentUser?.name}</h2>
          <p className="text-muted">
            <Calendar size={16} className="me-1" />
            {formattedDate}
          </p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm mb-4 bg-primary text-white">
            <Card.Body className="p-4">
              <h3>Welcome to MilitaryConnect</h3>
              <p>
                Stay connected with your loved ones no matter the distance. Send letters, 
                care packages, and keep up with important updates all in one place.
              </p>
              <div className="d-flex gap-2 mt-3">
                <Button variant="light" onClick={() => navigate('/letters')}>
                  <Mail size={18} className="me-1" />
                  Write a Letter
                </Button>
                <Button variant="outline-light" onClick={() => navigate('/care-packages')}>
                  <Package size={18} className="me-1" />
                  Send a Care Package
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Row>
            <Col md={6}>
              <Card className="shadow-sm mb-4 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Recent Letters</h4>
                    {unreadLetters > 0 && (
                      <Badge bg="danger" pill>{unreadLetters} new</Badge>
                    )}
                  </div>
                  
                  {myLetters.length > 0 ? (
                    <div>
                      {myLetters.slice(0, 3).map(letter => (
                        <div key={letter.id} className="border-bottom py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold">
                              {letter.senderId === currentUser?.id ? 
                                `To: ${letter.recipientName}` : 
                                `From: ${letter.senderName}`}
                            </span>
                            <small className="text-muted">
                              <Clock size={14} className="me-1" />
                              {new Date(letter.dateSent).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="text-truncate mb-0">
                            {letter.content}
                          </p>
                        </div>
                      ))}
                      
                      <div className="text-center mt-3">
                        <Button variant="outline-primary" size="sm" onClick={() => navigate('/letters')}>
                          View All Letters
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No letters yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="shadow-sm mb-4 h-100">
                <Card.Body>
                  <h4 className="mb-3">Care Packages</h4>
                  
                  {myCarePackages.length > 0 ? (
                    <div>
                      {myCarePackages.slice(0, 2).map(pkg => (
                        <div key={pkg.id} className="border-bottom py-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold">
                              {pkg.senderId === currentUser?.id ? 
                                `To: ${pkg.recipientName}` : 
                                `From: ${pkg.senderName}`}
                            </span>
                            <Badge 
                              bg={pkg.status === 'delivered' ? 'success' : 
                                pkg.status === 'in-transit' ? 'warning' : 'info'}
                            >
                              {pkg.status}
                            </Badge>
                          </div>
                          <p className="mb-0 small">
                            {pkg.items.length} items • {new Date(pkg.dateSent).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      
                      <div className="text-center mt-3">
                        <Button variant="outline-primary" size="sm" onClick={() => navigate('/care-packages')}>
                          View All Packages
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No care packages yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h4 className="mb-3">My Profile</h4>
              
              <div className="text-center mb-4">
                <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <User size={40} />
                </div>
                <h5 className="mt-3 mb-0">{currentUser?.name}</h5>
                <p className="text-muted">
                  {currentUser?.role === 'military' ? 'Military Personnel' : 'Military Spouse'}
                </p>
              </div>
              
              <div className="mb-3">
                <strong>Email:</strong>
                <p>{currentUser?.email}</p>
              </div>
              
              {currentUser?.partnerName && (
                <div className="mb-3">
                  <strong>Connected to:</strong>
                  <p>{currentUser.partnerName}</p>
                </div>
              )}
              
              <Button variant="outline-secondary" className="w-100">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Quick Actions</h4>
              
              <div className="d-grid gap-2">
                <Button variant="outline-primary" className="text-start" onClick={() => navigate('/letters')}>
                  <Mail size={18} className="me-2" />
                  Write a New Letter
                </Button>
                <Button variant="outline-primary" className="text-start" onClick={() => navigate('/care-packages')}>
                  <Package size={18} className="me-2" />
                  Send a Care Package
                </Button>
                <Button variant="outline-secondary" className="text-start">
                  <MapPin size={18} className="me-2" />
                  Update Location
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;