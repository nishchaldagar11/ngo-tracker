import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});


// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (req) => {

    // 🔥 FIXED: get token from user object
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

      // remove both just in case
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;