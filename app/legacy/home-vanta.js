(() => {
    if (document.body?.dataset.page !== "home") return;

    const target = document.getElementById("homeVanta");
    if (!target) return;

    let effect = null;

    const init = () => {
        if (effect) return;
        if (!window.VANTA || typeof window.VANTA.CLOUDS !== "function") return;

        effect = window.VANTA.CLOUDS({
            el: target,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            skyColor: 0x484848,
            cloudColor: 0x818793,
            cloudShadowColor: 0x2d2d2d,
            sunColor: 0x555555,
            sunGlareColor: 0x3e3e3e,
        });
    };

    const tryInit = () => {
        init();
        if (!effect) {
            window.setTimeout(init, 300);
            window.setTimeout(init, 900);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tryInit, {
            once: true,
        });
    } else {
        tryInit();
    }

    window.addEventListener("beforeunload", () => {
        if (!effect || typeof effect.destroy !== "function") return;
        effect.destroy();
        effect = null;
    });
})();
