import axios from "axios";
const rawBaseUrl = import.meta.env.VITE_BACKEND_BASE_URI || "http://localhost:5000";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

const axiosInstance = axios.create({
    baseURL: `${cleanBaseUrl}/api/v1`,
    withCredentials: true,
});

// Request interceptor to attach Bearer token and x-access-token header
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                config.headers["x-access-token"] = token;
            }
        } catch (e) {
            console.debug("Axios token read error:", e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to synchronize returned token
axiosInstance.interceptors.response.use(
    (response) => {
        const token = response?.data?.token;
        if (token && typeof token === "string") {
            try {
                localStorage.setItem("token", token);
                sessionStorage.setItem("token", token);
            } catch (e) {
                console.debug("Axios token save error:", e);
            }
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;

