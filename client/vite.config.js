import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    preview: {
        port: 4173, // 👈 important!
        host: true, // 👈 expose to 0.0.0.0
        allowedHosts: ["chat-application-client-ajgw.onrender.com"],
    },
});
