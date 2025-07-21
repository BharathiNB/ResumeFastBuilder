import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  getRedirectResult,
  signOut,
  onAuthStateChanged, 
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Check if we're in development mode without Firebase credentials
const isDevelopmentMode = false

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // useEffect(() => {
  //   // if (isDevelopmentMode) {
  //   //   // In development mode without Firebase, just set loading to false
  //   //   setLoading(false);
  //   //   return;
  //   // }

  //   // Production Firebase auth setup
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   // Handle redirect result on page load
  //   getRedirectResult(auth)
    

  //   return unsubscribe;
  // }, [toast]);

  const signInWithGoogle = async () => {
   
    // if (isDevelopmentMode) {
    //   // Show development mode message
    //   toast({
    //     title: "Development Mode",
    //     description: "Firebase authentication not configured. Set up Firebase credentials to enable Google login.",
    //   });
    //   return;
    // }

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      console.log("=======auth",auth)
    // const data=  await signInWithRedirect(auth, provider);
      signInWithPopup(auth, provider).then((result) => {
        console.log("=======auth data",result)
      if (result) {
        setUser(result.user);
        toast({
          title: "Welcome!",
          description: "Successfully signed in with Google.",
        });
      }
    })
    .catch((error) => {
      console.error('Auth redirect error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Error", 
        description: "Failed to sign in. Please try again.",
      });
    })
    .finally(() => {
      setLoading(false);
    });

    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: "Failed to initiate Google sign in.",
      });
    }
  };

  const logout = async () => {
    if (isDevelopmentMode) {
      toast({
        title: "Development Mode",
        description: "No user session to sign out from.",
      });
      return;
    }

    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Failed to sign out.",
      });
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
