import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Package, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand href="/" className="d-flex align-items-center">
          <Shield size={24} className="me-2" />
          <span>MilitaryConnect</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link onClick={() => navigate('/dashboard')} className="d-flex align-items-center">
                  <User size={18} className="me-1" />
                  <span>Dashboard</span>
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/letters')} className="d-flex align-items-center">
                  <Mail size={18} className="me-1" />
                  <span>Letters</span>
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/care-packages')} className="d-flex align-items-center">
                  <Package size={18} className="me-1" />
                  <span>Care Packages</span>
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="d-flex align-items-center text-danger">
                  <LogOut size={18} className="me-1" />
                  <span>Logout</span>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate('/signup')}>Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;