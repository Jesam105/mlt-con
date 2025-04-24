import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { Package, PlusCircle, Trash2, Send, ShoppingBag } from 'lucide-react';

interface NewItem {
  name: string;
  quantity: number;
}

const CarePackages: React.FC = () => {
  const { currentUser } = useAuth();
  const { carePackages, sendCarePackage } = useMessages();
  
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  
  const [items, setItems] = useState<NewItem[]>([
    { name: '', quantity: 1 }
  ]);
  const [message, setMessage] = useState('');
  
  // Filter packages for the current user
  const myPackages = carePackages.filter(pkg => 
    pkg.recipientId === currentUser?.id || pkg.senderId === currentUser?.id);
  
  // Get the selected package
  const activePackage = myPackages.find(pkg => pkg.id === selectedPackage);
  
  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1 }]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const handleItemChange = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  
  const handleSendPackage = () => {
    if (currentUser && currentUser.partnerId && currentUser.partnerName) {
      const validItems = items.filter(item => item.name.trim() !== '');
      
      if (validItems.length > 0) {
        sendCarePackage(
          currentUser.id,
          currentUser.name,
          currentUser.partnerId,
          currentUser.partnerName,
          validItems,
          message
        );
        
        setItems([{ name: '', quantity: 1 }]);
        setMessage('');
        setShowNewPackageForm(false);
      }
    }
  };
  
  return (
    <Container className="py-4">
      <h2 className="mb-4">Care Packages</h2>
      
      <Row>
        <Col lg={4}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>My Packages</h4>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                setSelectedPackage(null);
                setShowNewPackageForm(!showNewPackageForm);
              }}
            >
              <Package size={16} className="me-1" />
              {showNewPackageForm ? 'Cancel' : 'New Package'}
            </Button>
          </div>
          
          <Card className="shadow-sm mb-4">
            <ListGroup variant="flush">
              {myPackages.length > 0 ? (
                myPackages.map(pkg => (
                  <ListGroup.Item 
                    key={pkg.id}
                    action
                    active={pkg.id === selectedPackage}
                    onClick={() => {
                      setSelectedPackage(pkg.id);
                      setShowNewPackageForm(false);
                    }}
                    className="border-bottom"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">
                          {pkg.senderId === currentUser?.id ? 
                            `To: ${pkg.recipientName}` : 
                            `From: ${pkg.senderName}`}
                        </div>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {pkg.items.length} items
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <small>
                          {new Date(pkg.dateSent).toLocaleDateString()}
                        </small>
                        <Badge 
                          bg={pkg.status === 'delivered' ? 'success' : 
                            pkg.status === 'in-transit' ? 'warning' : 'info'}
                          className="mt-1"
                        >
                          {pkg.status}
                        </Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center py-4 text-muted">
                  No care packages yet
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm">
            {showNewPackageForm ? (
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Send a Care Package</h4>
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
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="m-0">Items</Form.Label>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={handleAddItem}
                      >
                        <PlusCircle size={16} className="me-1" />
                        Add Item
                      </Button>
                    </div>
                    
                    {items.map((item, index) => (
                      <div key={index} className="d-flex gap-2 mb-2">
                        <Form.Control
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        />
                        <Form.Control
                          type="number"
                          min="1"
                          style={{ width: '100px' }}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        />
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Personal Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a personal message..."
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={handleSendPackage}
                      disabled={
                        !items.some(item => item.name.trim() !== '') || 
                        !currentUser?.partnerId
                      }
                    >
                      <Send size={16} className="me-1" />
                      Send Package
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            ) : activePackage ? (
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="mb-0">
                      {activePackage.senderId === currentUser?.id ? 
                        `To: ${activePackage.recipientName}` : 
                        `From: ${activePackage.senderName}`}
                    </h4>
                    <p className="text-muted mb-0">
                      Sent on {new Date(activePackage.dateSent).toLocaleDateString()} • 
                      <Badge 
                        bg={activePackage.status === 'delivered' ? 'success' : 
                          activePackage.status === 'in-transit' ? 'warning' : 'info'}
                        className="ms-2"
                      >
                        {activePackage.status}
                      </Badge>
                    </p>
                  </div>
                  
                  {activePackage.senderId !== currentUser?.id && (
                    <Button 
                      variant="outline-primary"
                      onClick={() => {
                        setItems([{ name: '', quantity: 1 }]);
                        setMessage('');
                        setShowNewPackageForm(true);
                      }}
                    >
                      Send a Package Back
                    </Button>
                  )}
                </div>
                
                <Card className="bg-light mt-3 mb-3">
                  <Card.Body>
                    <h5 className="mb-3">Package Contents</h5>
                    <ListGroup>
                      {activePackage.items.map((item) => (
                        <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <ShoppingBag size={18} className="text-primary me-2" />
                            {item.name}
                          </div>
                          <Badge bg="secondary">x{item.quantity}</Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
                
                {activePackage.message && (
                  <div>
                    <h5>Personal Message</h5>
                    <Card className="bg-light">
                      <Card.Body>
                        <p style={{ whiteSpace: 'pre-line' }}>{activePackage.message}</p>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Card.Body>
            ) : (
              <Card.Body className="text-center py-5">
                <Package size={48} className="text-muted mb-3" />
                <h4>Select a package to view</h4>
                <p className="text-muted">
                  Or click on "New Package" to send a care package
                </p>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CarePackages;