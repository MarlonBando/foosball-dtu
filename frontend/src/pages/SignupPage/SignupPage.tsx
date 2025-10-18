import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.css';
import Logo from '../../components/Logo/Logo';
import PageLayout from '../../components/PageLayout/PageLayout';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [experience, setExperience] = useState('Beginner');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign Up clicked', { username, password, name, surname, experience });
    // Implement actual sign-up logic here
  };

  return (
    <PageLayout variant="centered" backgroundColor="#f0f2f5">
      <div className="signup-container">
        <Logo className="signup-logo" />
        <h2 className="signup-title">Join Us!</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
            required
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="signup-input"
            required
          />

          <div className="experience-level">
            <p>Level of Experience:</p>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Beginner"
                  checked={experience === 'Beginner'}
                  onChange={(e) => setExperience(e.target.value)}
                />
                Beginner
              </label>
              <label>
                <input
                  type="radio"
                  value="Decent"
                  checked={experience === 'Decent'}
                  onChange={(e) => setExperience(e.target.value)}
                />
                Decent
              </label>
              <label>
                <input
                  type="radio"
                  value="Good"
                  checked={experience === 'Good'}
                  onChange={(e) => setExperience(e.target.value)}
                />
                Good
              </label>
              <label>
                <input
                  type="radio"
                  value="Pro"
                  checked={experience === 'Pro'}
                  onChange={(e) => setExperience(e.target.value)}
                />
                Pro
              </label>
            </div>
          </div>

          <button type="submit" className="signup-button primary">Sign Up</button>
        </form>
        <div className="signup-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="signup-button secondary">Back to Login</Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default SignupPage;
