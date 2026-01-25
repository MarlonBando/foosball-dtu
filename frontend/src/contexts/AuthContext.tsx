import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { getAllPlayers, getCurrentPlayer } from '../api/services/playerService';
import { getPlayerMatches, getMatchDetails } from '../api/services/matchService';
import { getAllNationalities } from '../api/services/nationalityService';

const API_URL = import.meta.env.VITE_BACKEND_URL || '/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  playerId: number | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: UserMetadata) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface UserMetadata {
  username: string;
  name: string;
  surname: string;
  nationality: number;
  experience: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch player_id from backend using the session token
      if (session?.user) {
        try {
          const response = await fetch(`${API_URL}/players/me`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          if (response.ok) {
            const player = await response.json();
            setPlayerId(player.id);
          } else {
            setPlayerId(null);
          }
        } catch (error) {
          console.error('Failed to fetch player:', error);
          setPlayerId(null);
        }
      } else {
        setPlayerId(null);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch player_id from backend when auth state changes
      if (session?.user) {
        try {
          const response = await fetch(`${API_URL}/players/me`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          if (response.ok) {
            const player = await response.json();
            setPlayerId(player.id);
          } else {
            setPlayerId(null);
          }
        } catch (error) {
          console.error('Failed to fetch player:', error);
          setPlayerId(null);
        }
      } else {
        setPlayerId(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Prefetch all data when playerId is available
  useEffect(() => {
    if (playerId) {
      // Prefetch all data in parallel
      queryClient.prefetchQuery({
        queryKey: ['players'],
        queryFn: getAllPlayers,
      });

      queryClient.prefetchQuery({
        queryKey: ['currentPlayer'],
        queryFn: getCurrentPlayer,
      });

      queryClient.prefetchQuery({
        queryKey: ['matches', playerId],
        queryFn: async () => {
          const matches = await getPlayerMatches(playerId);
          const detailsPromises = matches.map(m => getMatchDetails(m.id));
          return await Promise.all(detailsPromises);
        },
      });

      queryClient.prefetchQuery({
        queryKey: ['nationalities'],
        queryFn: getAllNationalities,
      });
    }
  }, [playerId, queryClient]);

  const signUp = async (email: string, password: string, metadata: UserMetadata) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    playerId,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
