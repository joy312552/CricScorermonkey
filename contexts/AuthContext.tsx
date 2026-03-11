
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, username: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string, email: string, retries = 2): Promise<User> => {
    for (let i = 0; i <= retries; i++) {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      try {
        const fetchPromise = supabase
          .from('profiles')
          .select('name, username')
          .eq('id', id)
          .maybeSingle();

        const result: any = await Promise.race([fetchPromise, timeoutPromise]);
        const { data, error } = result;
        
        if (error) {
          throw error;
        }

        if (data) {
          return {
            id,
            email,
            name: data.name,
            username: data.username,
            role: 'scorer' as Role
          };
        }
        
        // If data is null, it means profile doesn't exist yet, no need to retry
        break;
      } catch (err: any) {
        if (i === retries) {
          console.warn("Profile fetch issue after retries, using fallback:", err.message);
        } else {
          console.log(`Profile fetch attempt ${i + 1} failed, retrying...`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    // Default fallback
    return {
      id,
      email,
      name: email.split('@')[0],
      username: email.split('@')[0],
      role: 'scorer' as Role
    };
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id, session.user.email || '');
      setUser(profile);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      let retries = 3;
      while (retries >= 0) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (isMounted) {
            if (session?.user) {
              const profile = await fetchProfile(session.user.id, session.user.email || '');
              setUser(profile);
            } else {
              setUser(null);
            }
          }
          break; // Success, exit loop
        } catch (err: any) {
          const isLockError = err?.message?.includes('Lock broken') || err?.message?.includes('steal');
          if (isLockError && retries > 0) {
            console.warn(`Auth lock issue, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 500));
            retries--;
          } else {
            if (!isLockError) {
              console.error("Auth initialization failed:", err);
            }
            break; // Non-lock error or out of retries, exit loop
          }
        }
      }
      if (isMounted) setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email || '');
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Safety timeout: If auth hasn't initialized in 3 seconds, stop the loading spinner
    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      
      if (data.user) {
        console.log("Login successful, fetching profile...");
        const profile = await fetchProfile(data.user.id, data.user.email || '');
        setUser(profile);
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const signup = async (name: string, username: string, email: string, pass: string) => {
    try {
      console.log("Attempting signup for:", email);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: pass
      });
      
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Signup failed.');

      console.log("Auth user created, inserting profile...");
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: data.user.id, name, username: username.toLowerCase() }
        ]);
      
      if (profileError) {
        if (profileError.message.includes('profiles')) {
          console.warn("Auth user created, but 'profiles' table is missing.");
        } else if (profileError.code === '23505') {
          throw new Error('Username already taken.');
        } else {
          throw profileError;
        }
      }
      
      console.log("Signup successful");
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
