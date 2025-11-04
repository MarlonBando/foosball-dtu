import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllNationalities, addPlayer } from '../../api';
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
  const navigate = useNavigate();

  useEffect(() => {
    getAllNationalities().then(setNationalities).catch(console.error);
  }, []);

  const getStartingElo = (experienceLevel: string): number => {
    switch (experienceLevel) {
      case 'Beginner':
        return 800;
      case 'Decent':
        return 1000;
      case 'Good':
        return 1200;
      case 'Pro':
        return 1400;
      default:
        return 1000;
    }
  };


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name,
            surname,
            nationality: parseInt(nationality),
            experience,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      // Step 2: Get the user_id from the signup response
      const userId = data.user?.id;
      
      if (!userId) {
        throw new Error('Failed to get user ID after signup');
      }
      
      // Step 3: Create player record with user_id and experience-based starting ELO
      const startingElo = getStartingElo(experience);
      await addPlayer({
        username,
        name,
        surname,
        nationality: parseInt(nationality),
        elo: startingElo,
        wins: 0,
        losses: 0,
        user_id: userId,
      } as any);
      
      alert('Signup successful! You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
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
