const toggle = document.getElementById("themeToggle");
const themeStore = window.ndTheme;

function applyThemeFallback(theme) {
    const resolvedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
    window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme: resolvedTheme } }),
    );
}

function getCurrentTheme() {
    if (themeStore && typeof themeStore.getTheme === "function") {
        return themeStore.getTheme();
    }
    return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
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

if (themeStore && typeof themeStore.init === "function") {
    themeStore.init();
}

updateToggleLabel();

if (themeStore && typeof themeStore.subscribe === "function") {
    themeStore.subscribe(() => {
        updateToggleLabel();
    });
} else {
    window.addEventListener("themechange", updateToggleLabel);
}

if (toggle) {
    toggle.addEventListener("click", () => {
        if (themeStore && typeof themeStore.toggleTheme === "function") {
            themeStore.toggleTheme();
        } else {
            const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
            applyThemeFallback(nextTheme);
        }
        updateToggleLabel();
    });
}
