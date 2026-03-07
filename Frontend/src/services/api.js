import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});


// =============================
// REQUEST INTERCEPTOR
// Automatically attach token
// =============================
API.interceptors.request.use(
  (req) => {

    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =============================
// RESPONSE INTERCEPTOR
// Auto logout if token expired
// =============================
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {

      console.log("Token expired. Logging out...");

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default API;