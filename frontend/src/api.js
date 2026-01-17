import axios from "axios";

let setGlobalLoading = null;

/**
 * This function is called ONCE from App.jsx
 * to register the global loader setter
 */
export const setLoader = (setLoading) => {
  setGlobalLoading = setLoading;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, // keep false unless using cookies
});

/* =========================
   REQUEST INTERCEPTOR
   - Show loader
   - Attach JWT token
========================= */
API.interceptors.request.use(
  (config) => {
    // Show global loader
    if (setGlobalLoading) {
      setGlobalLoading(true);
    }

    // Attach token if exists
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    if (setGlobalLoading) {
      setGlobalLoading(false);
    }
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE INTERCEPTOR
   - Hide loader
   - Handle auth errors
========================= */
API.interceptors.response.use(
  (response) => {
    if (setGlobalLoading) {
      setGlobalLoading(false);
    }
    return response;
  },
  (error) => {
    if (setGlobalLoading) {
      setGlobalLoading(false);
    }

    // Handle unauthorized globally
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optional redirect
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
