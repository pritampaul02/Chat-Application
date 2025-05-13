import axios from "axios";
const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URI}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
export default axiosInstance;
