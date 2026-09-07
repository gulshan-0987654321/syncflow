const rawApiUrl = import.meta.env.VITE_API_URL;
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
const defaultBackend = import.meta.env.PROD ? 'https://syncflow-backend-rf0d.onrender.com' : 'http://localhost:5000';

const BACKEND_URL = rawBackendUrl ? rawBackendUrl.replace(/\/+$/, '') : (rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : defaultBackend);
const API_BASE_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : `${BACKEND_URL}/api`;

export const registerUserAPI = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const loginUserAPI = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const loginWithGoogleAPI = async (googleData) => {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Google authentication failed');
  return data;
};

export const sendVerificationOtpAPI = async (email) => {
  const res = await fetch(`${API_BASE_URL}/auth/send-verification-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send verification code');
  return data;
};

export const verifyEmailOtpAPI = async (verifyData) => {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verifyData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Verification failed');
  return data;
};

export const fetchProfileAPI = async (token) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data.userData;
};

export const updateProfileAPI = async (token, updateData) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data.userData;
};

export const fetchDevelopersAPI = async (token, { skill, search } = {}) => {
  const params = new URLSearchParams();
  if (skill && skill !== 'all') params.append('skill', skill);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE_URL}/users/developers?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch developers');
  return data.registeredMembers || data.developers || [];
};
