
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

type StoredUser = {
  email: string;
  password: string;
  userData: User;
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

  // Initialize users in localStorage if it doesn't exist
  useEffect(() => {
    const storedUsers = localStorage.getItem('calovate_users');
    if (!storedUsers) {
      // Initialize with demo user
      const initialUsers: StoredUser[] = [
        {
          email: "demo@example.com",
          password: "password",
          userData: mockUser
        }
      ];
      localStorage.setItem('calovate_users', JSON.stringify(initialUsers));
    }
  }, []);
  
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
      
      // Also update the user data in the users array
      const storedUsers = JSON.parse(localStorage.getItem('calovate_users') || '[]');
      const updatedUsers = storedUsers.map((user: StoredUser) => {
        if (user.userData.email === currentUser.email) {
          return {
            ...user,
            userData: currentUser
          };
        }
        return user;
      });
      localStorage.setItem('calovate_users', JSON.stringify(updatedUsers));
    } else {
      localStorage.removeItem('calovate_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Get users from localStorage
      const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('calovate_users') || '[]');
      
      // Find user with matching email and password
      const user = storedUsers.find(user => 
        user.email === email && user.password === password
      );
      
      if (user) {
        setCurrentUser(user.userData);
        toast({
          title: "Login successful!",
          description: `Welcome back, ${user.userData.name}!`,
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
      // Get users from localStorage
      const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('calovate_users') || '[]');
      
      // Check if user already exists
      const userExists = storedUsers.some(user => user.email === email);
      if (userExists) {
        toast({
          title: "Signup failed",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUserId = `user-${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        name,
        email,
        goals: {
          calories: 2000,
          protein: 120,
          carbs: 250,
          sugar: 50,
          fat: 70,
        }
      };
      
      // Add user to stored users
      const newStoredUser: StoredUser = {
        email,
        password,
        userData: newUser
      };
      
      storedUsers.push(newStoredUser);
      localStorage.setItem('calovate_users', JSON.stringify(storedUsers));
      
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
