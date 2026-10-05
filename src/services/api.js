import axios from "axios";

const API = axios.create({
  baseURL: "https://attendify-backend-6ehl.onrender.com",
});

export default API;