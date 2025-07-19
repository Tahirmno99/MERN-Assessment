import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    if (savedToken) setTokenState(savedToken);
  }, []);

  const login = (jwt) => {
    sessionStorage.setItem('token', jwt);
    setTokenState(jwt);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
