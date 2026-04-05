import axios from "axios";

// ✅ Dynamic base URL (dev + production)
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});


// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (req) => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {
      console.log("Token expired. Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;