import axios from "axios";

let setGlobalLoading = null;

// this function will be called ONCE from App.jsx
export const setLoader = (setLoading) => {
  setGlobalLoading = setLoading;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* REQUEST → SHOW LOADER */
API.interceptors.request.use(
  (config) => {
    if (setGlobalLoading) {
      setGlobalLoading(true);
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
    return Promise.reject(error);
  }
);

export default API;
