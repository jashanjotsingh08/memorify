import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/uselocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  const login = async (data) => {
    console.log('This was called');
    setUser(data);
    // navigate('/', { replace: true }); // Use replace to replace the current entry in the history stack
  };

  const logout = () => {
    setUser(null);
    navigate('/login'); // Redirect to the login page after logout
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
