import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import Logo from '../../components/Logo/Logo';
import PageLayout from '../../components/PageLayout/PageLayout';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign In clicked', { username, password });
    // Implement actual sign-in logic here
  };

  return (
    <PageLayout variant="centered" backgroundColor="#f0f2f5">
      <div className="login-container">
        <Logo className="login-logo" />
        <h2 className="login-title">Welcome Back!</h2>
        <form onSubmit={handleSignIn} className="login-form">
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
          <button type="submit" className="login-button primary">Sign In</button>
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
