
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase, DbUser, getUserById, updateUserGoals as updateGoalsInDb } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
  name: string;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    sugar: number;
    fat: number;
  };
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserGoals: (goals: User['goals']) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Default goals for new users
const defaultGoals = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  sugar: 50,
  fat: 70,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Check auth state on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          const userData = await getUserById(session.user.id);
          if (userData) {
            setCurrentUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              goals: userData.goals,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const userData = await getUserById(session.user.id);
          if (userData) {
            setCurrentUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              goals: userData.goals,
            });
          }
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        const userData = await getUserById(data.user.id);
        if (userData) {
          setCurrentUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            goals: userData.goals,
          });
          
          toast({
            title: "Login successful!",
            description: `Welcome back, ${userData.name}!`,
          });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(error);
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // Create a record in our users table
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: name,
            goals: defaultGoals,
          },
        ]);

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          toast({
            title: "Account creation failed",
            description: "Could not create user profile.",
            variant: "destructive",
          });
          return false;
        }

        // Set the current user
        setCurrentUser({
          id: data.user.id,
          email: data.user.email || "",
          name,
          goals: defaultGoals,
        });

        toast({
          title: "Account created!",
          description: `Welcome to Calovate, ${name}!`,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      toast({
        title: "Signup error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Logout error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserGoals = async (goals: User['goals']) => {
    if (!currentUser) return;
    
    try {
      await updateGoalsInDb(currentUser.id, goals);
      
      setCurrentUser({
        ...currentUser,
        goals,
      });
      
      toast({
        title: "Goals updated!",
        description: "Your nutrition goals have been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update error",
        description: "Failed to update your goals. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUserGoals,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
