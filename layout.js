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

attachRouteTransition();
