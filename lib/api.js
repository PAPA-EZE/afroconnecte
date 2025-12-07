import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error('Unauthorized access - redirecting to login');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Authentication services
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const oauthLogin = (providerData) => api.post('/auth/oauth', providerData);
export const refreshToken = () => api.post('/auth/refresh-token');
export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const changePassword = (passwordData) => api.put('/auth/change-password', passwordData);

// Discovery services
export const getDiscoveryProfiles = (filters) => api.get('/discovery/profiles', { params: filters });
export const getProfileById = (userId) => api.get(`/discovery/profiles/${userId}`);
export const swipeProfile = (userId, data) => api.post(`/discovery/swipe/${userId}`, data);
export const rewindLastSwipe = () => api.post('/discovery/rewind');
export const getWhoLikedMe = () => api.get('/discovery/who-liked-me');
export const activateBoost = () => api.post('/discovery/boost');

// Event services
export const getEvents = () => api.get('/events');
export const getMyEvents = () => api.get('/events/my-events');
export const getEventById = (eventId) => api.get(`/events/${eventId}`);
export const createEvent = (eventData) => api.post('/events', eventData);
export const participateEvent = (eventId) => api.post(`/events/${eventId}/participate`);
export const cancelParticipation = (eventId) => api.delete(`/events/${eventId}/participate`);

// Match services
export const getMatches = () => api.get('/matches');
export const getMatchById = (matchId) => api.get(`/matches/${matchId}`);
export const unmatch = (matchId) => api.delete(`/matches/${matchId}`);

// Message services
export const getIceBreakers = () => api.get('/messages/ice-breakers');
export const getMessages = (matchId) => api.get(`/messages/${matchId}`);
export const sendMessage = (matchId, messageData) => api.post(`/messages/${matchId}`, messageData);
export const deleteMessage = (matchId, messageId) => api.delete(`/messages/${matchId}/${messageId}`);
export const getReadStatus = (matchId, messageId) => api.get(`/messages/${matchId}/${messageId}/read-status`);

// Photo services
export const getPhotos = () => api.get('/photos');
export const uploadPhoto = (photoData) => api.post('/photos', photoData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePhoto = (photoId) => api.delete(`/photos/${photoId}`);
export const setPrimaryPhoto = (photoId) => api.put(`/photos/${photoId}/primary`);
export const reorderPhotos = (photoOrder) => api.put('/photos/reorder', photoOrder);
export const uploadVerificationPhoto = (photoData) => api.post('/photos/verification', photoData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Profile services
export const getProfile = () => api.get('/profile');
export const updateProfile = (profileData) => api.put('/profile', profileData);
export const updateLanguages = (languages) => api.put('/profile/languages', languages);
export const completeOnboarding = () => api.post('/profile/complete-onboarding');
export const updateLocation = (location) => api.put('/profile/location', location);
export const setPassportLocation = (location) => api.put('/profile/passport', location);
export const clearPassportLocation = () => api.delete('/profile/passport');
export const toggleIncognito = () => api.post('/profile/incognito');
export const getEthnicities = () => api.get('/profile/ethnicities');
export const getCountries = () => api.get('/profile/countries');
export const getLanguages = () => api.get('/profile/languages');

// Report services
export const reportUser = (userId, reportData) => api.post(`/reports/user/${userId}`, reportData);
export const blockUser = (userId) => api.post(`/reports/block/${userId}`);
export const unblockUser = (userId) => api.delete(`/reports/block/${userId}`);
export const getBlockedUsers = () => api.get('/reports/blocked');

// Subscription services
export const getPlans = () => api.get('/subscriptions/plans');
export const getCurrentSubscription = () => api.get('/subscriptions/current');
export const createCheckoutSession = (planId) => api.post('/subscriptions/checkout', { planId });
export const cancelSubscription = () => api.post('/subscriptions/cancel');

export default api;
