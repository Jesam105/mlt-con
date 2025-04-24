import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { Mail, Send } from 'lucide-react';

const Letters: React.FC = () => {
  const { currentUser } = useAuth();
  const { letters, sendLetter } = useMessages();
  
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [newLetterContent, setNewLetterContent] = useState('');
  const [showNewLetterForm, setShowNewLetterForm] = useState(false);
  
  // Filter letters for the current user
  const myLetters = letters.filter(letter => 
    letter.recipientId === currentUser?.id || letter.senderId === currentUser?.id);
  
  // Get the selected letter
  const activeLetter = myLetters.find(letter => letter.id === selectedLetter);
  
  const handleSendLetter = () => {
    if (currentUser && currentUser.partnerId && currentUser.partnerName && newLetterContent.trim()) {
      sendLetter(
        currentUser.id,
        currentUser.name,
        currentUser.partnerId,
        currentUser.partnerName,
        newLetterContent
      );
      setNewLetterContent('');
      setShowNewLetterForm(false);
    }
  };
  
  return (
    <Container className="py-4">
      <h2 className="mb-4">Letters</h2>
      
      <Row>
        <Col lg={4}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Inbox</h4>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                setSelectedLetter(null);
                setShowNewLetterForm(!showNewLetterForm);
              }}
            >
              <Mail size={16} className="me-1" />
              {showNewLetterForm ? 'Cancel' : 'New Letter'}
            </Button>
          </div>
          
          <Card className="shadow-sm mb-4">
            <ListGroup variant="flush">
              {myLetters.length > 0 ? (
                myLetters.map(letter => (
                  <ListGroup.Item 
                    key={letter.id}
                    action
                    active={letter.id === selectedLetter}
                    onClick={() => {
                      setSelectedLetter(letter.id);
                      setShowNewLetterForm(false);
                    }}
                    className="border-bottom"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">
                          {letter.senderId === currentUser?.id ? 
                            `To: ${letter.recipientName}` : 
                            `From: ${letter.senderName}`}
                        </div>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {letter.content}
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small>
                          {new Date(letter.dateSent).toLocaleDateString()}
                        </small>
                        {!letter.isRead && letter.recipientId === currentUser?.id && (
                          <Badge bg="danger" pill className="mt-1">New</Badge>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center py-4 text-muted">
                  No letters yet
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm">
            {showNewLetterForm ? (
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">New Letter</h4>
                </div>
                
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser?.partnerName || 'No partner connected'}
                      disabled
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={newLetterContent}
                      onChange={(e) => setNewLetterContent(e.target.value)}
                      placeholder="Write your letter here..."
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={handleSendLetter}
                      disabled={!newLetterContent.trim() || !currentUser?.partnerId}
                    >
                      <Send size={16} className="me-1" />
                      Send Letter
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : activeLetter ? (
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="mb-0">
                      {activeLetter.senderId === currentUser?.id ? 
                        `To: ${activeLetter.recipientName}` : 
                        `From: ${activeLetter.senderName}`}
                    </h4>
                    <p className="text-muted mb-0">
                      {new Date(activeLetter.dateSent).toLocaleString()}
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline-primary"
                    onClick={() => {
                      setNewLetterContent('');
                      setShowNewLetterForm(true);
                    }}
                  >
                    Reply
                  </Button>
                </div>
                
                <Card className="bg-light mt-3">
                  <Card.Body>
                    <p style={{ whiteSpace: 'pre-line' }}>{activeLetter.content}</p>
                  </Card.Body>
                </Card>
              </Card.Body>
            ) : (
              <Card.Body className="text-center py-5">
                <Mail size={48} className="text-muted mb-3" />
                <h4>Select a letter to view</h4>
                <p className="text-muted">
                  Or click on "New Letter" to write a message
                </p>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Letters;