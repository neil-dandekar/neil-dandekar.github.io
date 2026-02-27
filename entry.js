(() => {
    const s = document.createElement('script');
    s.src = '/app/legacy/entry.js';
    s.defer = true;
    document.head.appendChild(s);
})();
