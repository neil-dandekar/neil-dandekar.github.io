const THEME_KEY = "nd-theme";
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

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
    return "dark";
}

function getCurrentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme, emitEvent = true) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    if (emitEvent) {
        window.dispatchEvent(
            new CustomEvent("themechange", { detail: { theme } }),
        );
    }
}

function updateToggleLabel() {
    if (!toggle) return;
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    toggle.setAttribute(
        "aria-pressed",
        currentTheme === "dark" ? "true" : "false",
    );
}

function initializeTheme() {
    const storedTheme = readStoredTheme();
    const existingTheme = root.getAttribute("data-theme");
    if (storedTheme) {
        applyTheme(storedTheme, false);
    } else if (existingTheme !== "light" && existingTheme !== "dark") {
        applyTheme(detectSystemTheme(), false);
    } else {
        root.style.colorScheme = getCurrentTheme();
    }
    updateToggleLabel();
}

initializeTheme();

if (toggle) {
    toggle.addEventListener("click", () => {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        writeStoredTheme(nextTheme);
        updateToggleLabel();
    });
}

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const handleSystemThemeChange = (event) => {
    if (readStoredTheme()) return;
    applyTheme("dark");
    updateToggleLabel();
};

if (typeof darkModeMediaQuery.addEventListener === "function") {
    darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
} else if (typeof darkModeMediaQuery.addListener === "function") {
    darkModeMediaQuery.addListener(handleSystemThemeChange);
}
