import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUserAPI,
  registerUserAPI,
  loginWithGoogleAPI,
  sendVerificationOtpAPI,
  verifyEmailOtpAPI,
  fetchProfileAPI,
  updateProfileAPI,
} from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('syncflow_token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile on initial load or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfileAPI(token);
        setCurrentUser(profile);
      } catch (err) {
        console.warn('Auth token expired or invalid:', err.message);
        localStorage.removeItem('syncflow_token');
        setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUserAPI({ email, password });
    if (data.token) {
      localStorage.setItem('syncflow_token', data.token);
      setToken(data.token);
      if (data.user) {
        setCurrentUser(data.user);
      }
    }
    return data;
  };

  const register = async (username, email, password, skills = ['React', 'JavaScript']) => {
    const data = await registerUserAPI({ username, email, password, skills });
    if (data.token) {
      localStorage.setItem('syncflow_token', data.token);
      setToken(data.token);
      if (data.user) {
        setCurrentUser(data.user);
      }
    }
    return data;
  };

  const loginWithGoogle = async (googleUser) => {
    const data = await loginWithGoogleAPI(googleUser);
    if (data.token) {
      localStorage.setItem('syncflow_token', data.token);
      setToken(data.token);
      if (data.user) {
        setCurrentUser(data.user);
      }
    }
    return data;
  };

  const sendVerificationOtp = async (email) => {
    return await sendVerificationOtpAPI(email);
  };

  const verifyEmailOtp = async (verifyData) => {
    const data = await verifyEmailOtpAPI(verifyData);
    if (data.token) {
      localStorage.setItem('syncflow_token', data.token);
      setToken(data.token);
      if (data.user) {
        setCurrentUser(data.user);
      }
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('syncflow_token');
    setToken(null);
    setCurrentUser(null);
  };

  const updateProfile = async (updateData) => {
    if (!token) return;
    const updated = await updateProfileAPI(token, updateData);
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        setCurrentUser,
        loading,
        login,
        register,
        loginWithGoogle,
        sendVerificationOtp,
        verifyEmailOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
