import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';
import Logo from '../../components/Logo/Logo';
import PageLayout from '../../components/PageLayout/PageLayout';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Generate email from username
      const email = `${username}@foosballdtu.bando`;
      await signIn(email, password);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout variant="centered" backgroundColor="#f0f2f5">
      <div className="login-container">
        <Logo className="login-logo" />
        <h2 className="login-title">Welcome Back!</h2>
        <form onSubmit={handleSignIn} className="login-form">
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="login-footer">
          <p>Don't have an account?</p>
          <Link to="/signup" className="login-button secondary">Sign Up</Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
