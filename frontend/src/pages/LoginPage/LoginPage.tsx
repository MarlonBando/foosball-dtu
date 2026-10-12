import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import { AuthError, AuthInput, AuthSubmit } from '../../components/AuthLayout/AuthField';

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
      // Generate email from trimmed username
      const email = `${username.trim()}@foosballdtu.bando`;
      await signIn(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to climb the ranks"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        {error && <AuthError message={error} />}
        <AuthInput
          label="Username"
          icon={User}
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
        <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <AuthSubmit loading={loading} loadingLabel="Signing in...">
          <LogIn size={18} />
          Sign In
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
