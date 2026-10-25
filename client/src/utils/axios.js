import axios from "axios";
const rawBaseUrl = import.meta.env.VITE_BACKEND_BASE_URI || "http://localhost:5000";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

const axiosInstance = axios.create({
    baseURL: `${cleanBaseUrl}/api/v1`,
    withCredentials: true,
});
export default axiosInstance;
