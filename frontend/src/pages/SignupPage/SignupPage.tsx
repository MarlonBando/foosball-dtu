import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNationalities, addPlayer } from '../../api';
import { supabase } from '../../lib/supabase';
import type { Nationality } from '../../types';
import './SignupPage.css';
import Logo from '../../components/Logo/Logo';
import PageLayout from '../../components/PageLayout/PageLayout';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [nationality, setNationality] = useState('');
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [experience, setExperience] = useState('Beginner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getNationalities().then(setNationalities).catch(console.error);
  }, []);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create auth user
      await signUp(email, password, {
        username,
        name,
        surname,
        nationality: parseInt(nationality),
        experience,
      });
      
      // Step 2: Get the user_id from the session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error('Failed to get user ID after signup');
      }
      
      // Step 3: Create player record
      await addPlayer({
        user_id: userId,
        username,
        name,
        surname,
        nationality: parseInt(nationality),
        elo: 1000,
        wins: 0,
        losses: 0,
      });
      
      alert('Signup successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout variant="centered" backgroundColor="#f0f2f5">
      <div className="signup-container">
        <Logo className="signup-logo" />
        <h2 className="signup-title">Join Us!</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
          />
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
            minLength={6}
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
          
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="signup-input"
            required
          >
            <option value="" disabled>Select your nationality</option>
            {nationalities.map((nat) => (
              <option key={nat.id} value={nat.id}>
                {nat.name}
              </option>
            ))}
          </select>

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

          <button type="submit" className="signup-button primary" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
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
