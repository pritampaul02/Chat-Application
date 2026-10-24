import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    theme: "dark",
    toggleTheme: () => {},
    setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        try {
            const saved = localStorage.getItem("chat_theme");
            if (saved === "light" || saved === "dark") return saved;
        } catch {
            // fallback if localStorage not accessible
        }
        return "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.remove("dark");
            root.classList.add("light");
        } else {
            root.classList.remove("light");
            root.classList.add("dark");
        }
        try {
            localStorage.setItem("chat_theme", theme);
        } catch {}
    }, [theme]);

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const setTheme = (newTheme) => {
        if (newTheme === "light" || newTheme === "dark") {
            setThemeState(newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
