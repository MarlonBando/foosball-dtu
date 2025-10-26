import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  if (!user) return null;

  const isHomePage = location.pathname === '/home';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {!isHomePage && (
          <button 
            onClick={handleHomeClick}
            className="home-button"
          >
            <span className="arrow">←</span>
            <span className="home-text">Home</span>
          </button>
        )}
        <div className="navbar-right">
          <span className="user-email">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
