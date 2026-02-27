const LAYOUT_NAV_LINKS = [
    { node: "home", href: "/", label: "home.md" },
    { node: "experience", href: "/experience/", label: "experience.md" },
    { node: "thoughts", href: "/thoughts/", label: "thoughts/" },
];

const LAYOUT_SOCIAL_ICONS = {
    github: '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.77.6-3.35-1.17-3.35-1.17-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.9 1.53 2.35 1.09 2.92.83.09-.64.35-1.09.63-1.34-2.21-.25-4.53-1.1-4.53-4.91 0-1.09.39-1.98 1.02-2.67-.1-.25-.44-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.8c.85 0 1.71.11 2.51.32 1.91-1.29 2.74-1.02 2.74-1.02.55 1.37.21 2.39.11 2.64.64.69 1.02 1.58 1.02 2.67 0 3.82-2.32 4.66-4.54 4.9.36.31.67.92.67 1.86v2.84c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />',
    linkedin:
        '<path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56A1.94 1.94 0 1 0 3.3 4.94a1.94 1.94 0 0 0 3.86 0ZM20.7 13.2c0-3.06-1.63-4.48-3.8-4.48-1.75 0-2.54.96-2.98 1.64V8.5h-3.38V20h3.38v-6.38c0-.34.03-.68.13-.93.27-.68.88-1.38 1.9-1.38 1.35 0 1.9 1.03 1.9 2.55V20h3.38v-6.8Z" />',
    instagram:
        '<rect x="3.5" y="3.5" width="17" height="17" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" /><circle cx="17.3" cy="6.8" r="1.2" />',
    x: '<path d="M5.3 4h4.3l3.07 4.34L16.58 4h2.1l-5.08 5.78L19.3 20H15l-3.3-4.67L7.62 20h-2.1l5.15-5.87L5.3 4Z" />',
};

const LAYOUT_SOCIAL_LINKS = [
    { id: "socialGithub", key: "github", label: "GitHub" },
    { id: "socialLinkedin", key: "linkedin", label: "LinkedIn" },
    { id: "socialInstagram", key: "instagram", label: "Instagram" },
    { id: "socialX", key: "x", label: "X" },
];

function renderSiteLayout() {
    const contentSlot = document.querySelector("[data-layout-content]");
    if (!contentSlot) return;

    const pageMarkup = contentSlot.innerHTML;

    const navMarkup = LAYOUT_NAV_LINKS.map(
        ({ node, href, label }) =>
            `<a class="site-nav-link" data-node="${node}" href="${href}">${label}</a>`,
    ).join("");

    const socialMarkup = LAYOUT_SOCIAL_LINKS.map(
        ({ id, key, label }) => `
            <a class="topbar-icon-btn" id="${id}" href="#" target="_blank" rel="noreferrer noopener" aria-label="${label}">
                <svg viewBox="0 0 24 24" aria-hidden="true">${LAYOUT_SOCIAL_ICONS[key]}</svg>
            </a>
        `,
    ).join("");

    const shell = document.createElement("div");
    shell.className = "site-shell";
    shell.innerHTML = `
        <section class="topbar" aria-label="Current path and quick links">
            <p class="fs-path topbar-path" id="topbarPath"></p>
            <div class="topbar-actions">
                <div class="topbar-socials">${socialMarkup}</div>
                <div class="topbar-utility">
                    <button class="theme-toggle topbar-icon-btn" id="themeToggle" type="button" aria-label="Switch to dark theme" aria-pressed="false">
                        <span class="theme-icon theme-sun" aria-hidden="true">☀</span>
                        <span class="theme-icon theme-moon" aria-hidden="true">☾</span>
                    </button>
                </div>
            </div>
        </section>

        <aside class="site-sidebar" aria-label="Site navigation">
            <p class="site-sidebar-label">Folders</p>
            ${navMarkup}
        </aside>

        <main class="page">
            ${pageMarkup}
            <footer class="site-footer" aria-label="Footer">
                <p class="site-footer-credit" id="footerCredit">Built by Neil Dandekar.</p>
                <a class="site-footer-link" id="sourceCodeLink" href="#" target="_blank" rel="noreferrer noopener">Source code</a>
            </footer>
        </main>
    `;

    contentSlot.replaceWith(shell);
}

function attachRouteTransition() {
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
        if (link.target && link.target !== "_self") return;
        if (link.origin !== window.location.origin) return;
        if (link.hash && link.pathname === window.location.pathname) return;

        event.preventDefault();
        document.body.classList.add("is-leaving");
        window.setTimeout(() => {
            window.location.href = link.href;
        }, 120);
    });
}

renderSiteLayout();
attachRouteTransition();
