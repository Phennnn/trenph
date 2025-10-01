import axios from 'axios';

const instance = axios.create({
  baseURL: '/api' // Your API proxy prefix
});

// This is the important part: an "interceptor" that runs on every API response
instance.interceptors.response.use(
  (response) => response, // If the response is successful, just pass it through
  (error) => {
    // If the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error("Authentication error. Bad token. Clearing session.");
      // Remove the bad token from storage
      localStorage.removeItem('token');
      // Reload the entire application to the login screen
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;