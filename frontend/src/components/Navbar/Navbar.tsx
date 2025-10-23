import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div style={{ marginLeft: 'auto', padding: '1rem' }}>
        <span style={{ marginRight: '1rem', color: '#666' }}>
          {user.email}
        </span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
