import axios from "axios";

let setGlobalLoading = null;

// this function will be called ONCE from App.jsx
export const setLoader = (setLoading) => {
  setGlobalLoading = setLoading;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* REQUEST → SHOW LOADER + ADD TOKEN */
API.interceptors.request.use(
  (config) => {
    // Show global loader
    if (setGlobalLoading) {
      setGlobalLoading(true);
    }

    // Attach JWT token if available
    const token = localStorage.getItem("token");
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

/* RESPONSE → HIDE LOADER */
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

    // Optional: handle unauthorized globally
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login"; // enable if you want auto-redirect
    }

    return Promise.reject(error);
  }
);

export default API;
