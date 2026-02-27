import { useEffect, useRef } from 'react';

type VantaEffect = {
  destroy?: () => void;
};

declare global {
  interface Window {
    VANTA?: {
      CLOUDS?: (config: Record<string, unknown>) => VantaEffect;
    };
  }
}

const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
const VANTA_SRC = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js';

const scriptLoaders = new Map<string, Promise<void>>();

function loadScript(src: string) {
  const existing = scriptLoaders.get(src);
  if (existing) return existing;

  const loader = new Promise<void>((resolve, reject) => {
    const prior = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (prior) {
      if (prior.dataset.loaded === 'true') {
        resolve();
        return;
      }
      prior.addEventListener('load', () => resolve(), { once: true });
      prior.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });

  scriptLoaders.set(src, loader);
  return loader;
}

export function HomeBackground() {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let effect: VantaEffect | null = null;

    const init = async () => {
      await loadScript(THREE_SRC);
      await loadScript(VANTA_SRC);

      if (cancelled || !targetRef.current || !window.VANTA?.CLOUDS) return;

      effect = window.VANTA.CLOUDS({
        el: targetRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        skyColor: 0x484848,
        cloudColor: 0x818793,
        cloudShadowColor: 0x2d2d2d,
        sunColor: 0x555555,
        sunGlareColor: 0x3e3e3e
      });
    };

    void init();

    return () => {
      cancelled = true;
      if (effect?.destroy) effect.destroy();
      effect = null;
    };
  }, []);

  return <div className="home-vanta-bg" id="homeVanta" ref={targetRef} aria-hidden="true" />;
}
