
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

// Mock user data for demo purposes
const mockUser: User = {
  id: "user-123",
  email: "demo@example.com",
  name: "Demo User",
  goals: {
    calories: 2000,
    protein: 120,
    carbs: 250,
    sugar: 50,
    fat: 70,
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('calovate_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('calovate_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('calovate_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // In a real app, this would communicate with an authentication server
      if (email === "demo@example.com" && password === "password") {
        setCurrentUser(mockUser);
        toast({
          title: "Login successful!",
          description: `Welcome back, ${mockUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
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
      // In a real app, this would communicate with an API to create a user
      const newUser: User = {
        ...mockUser,
        name,
        email,
      };
      
      setCurrentUser(newUser);
      toast({
        title: "Account created!",
        description: `Welcome to Calovate, ${name}!`,
      });
      return true;
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

  const logout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserGoals = (goals: User['goals']) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        goals,
      });
      toast({
        title: "Goals updated!",
        description: "Your nutrition goals have been updated.",
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
