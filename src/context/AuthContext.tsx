import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, role: 'spouse' | 'military') => Promise<User>;
  logout: () => void;
}

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Jones',
    email: 'john@example.com',
    role: 'military',
    partnerId: '2',
    partnerName: 'Jane JOnes'
  },
  {
    id: '2',
    name: 'Jane Jones',
    email: 'jane@example.com',
    role: 'spouse',
    partnerId: '1',
    partnerName: 'John Jons'
  },
  {
    id: '3',
    name: 'Mike Smith',
    email: 'mike@example.com',
    role: 'military',
    partnerId: '4',
    partnerName: 'Sarah Smith'
  },
  {
    id: '4',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'spouse',
    partnerId: '3',
    partnerName: 'Mike Smith'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for existing user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email);
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string, role: 'spouse' | 'military'): Promise<User> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('User already exists'));
        } else {
          const newUser: User = {
            id: String(MOCK_USERS.length + 1),
            name,
            email,
            role
          };
          
          // In a real app, you would save this to a database
          // For this demo, we'll just set the current user
          setCurrentUser(newUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          resolve(newUser);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};