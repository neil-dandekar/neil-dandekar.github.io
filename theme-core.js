(() => {
    const THEME_KEY = "nd-theme";
    const root = document.documentElement;

    const listeners = new Set();
    let initialized = false;

    function readStoredTheme() {
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored === "light" || stored === "dark") return stored;
        } catch {
            // no-op
        }
        return null;
    }

    function writeStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {
            // no-op
        }
    }

    function detectSystemTheme() {
        if (typeof window.matchMedia !== "function") return "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function getCurrentTheme() {
        return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    function applyTheme(theme, { persist = false, emitEvent = true } = {}) {
        root.setAttribute("data-theme", theme);
        root.style.colorScheme = theme;

        if (persist) writeStoredTheme(theme);

        if (emitEvent) {
            const detail = { theme };
            window.dispatchEvent(new CustomEvent("themechange", { detail }));
            listeners.forEach((listener) => listener(theme));
        }
    }

    function getPreferredTheme() {
        const stored = readStoredTheme();
        if (stored) return stored;

        const existingTheme = root.getAttribute("data-theme");
        if (existingTheme === "light" || existingTheme === "dark") {
            return existingTheme;
        }

        return detectSystemTheme();
    }

    function setTheme(theme, options = {}) {
        applyTheme(theme === "dark" ? "dark" : "light", options);
    }

    function toggleTheme() {
        setTheme(getCurrentTheme() === "dark" ? "light" : "dark", {
            persist: true,
        });
    }

    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    function init() {
        if (initialized) return;
        initialized = true;

        setTheme(getPreferredTheme(), { emitEvent: false });

        if (typeof window.matchMedia !== "function") return;
        const darkModeMediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)",
        );
        const handleSystemThemeChange = (event) => {
            if (readStoredTheme()) return;
            setTheme(event.matches ? "dark" : "light");
        };

        if (typeof darkModeMediaQuery.addEventListener === "function") {
            darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
        } else if (typeof darkModeMediaQuery.addListener === "function") {
            darkModeMediaQuery.addListener(handleSystemThemeChange);
        }
    }

    const themeStore = {
        init,
        getTheme: getCurrentTheme,
        setTheme,
        toggleTheme,
        subscribe,
        readStoredTheme,
        detectSystemTheme,
    };

    window.ndTheme = themeStore;
    themeStore.init();
})();
