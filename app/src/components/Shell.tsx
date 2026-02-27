import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as LiquidGlass from 'liquid-glass-react';
import { useSiteContent } from '../lib/hooks';
import { HomeBackground } from './HomeBackground';

const Glass = (LiquidGlass as Record<string, React.ComponentType<{ children: React.ReactNode }> | undefined>).LiquidGlass;
const THEME_KEY = 'nd-theme';

function initialTheme(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function GithubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.77.6-3.35-1.17-3.35-1.17-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.9 1.53 2.35 1.09 2.92.83.09-.64.35-1.09.63-1.34-2.21-.25-4.53-1.1-4.53-4.91 0-1.09.39-1.98 1.02-2.67-.1-.25-.44-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.8c.85 0 1.71.11 2.51.32 1.91-1.29 2.74-1.02 2.74-1.02.55 1.37.21 2.39.11 2.64.64.69 1.02 1.58 1.02 2.67 0 3.82-2.32 4.66-4.54 4.9.36.31.67.92.67 1.86v2.84c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const content = useSiteContent();
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const isHomeRoute = location.pathname === '/';

  const rootName = useMemo(() => {
    const siteName = content.site.name;
    return siteName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }, [content]);

  const currentPath = `/${location.pathname.split('/').filter(Boolean).join('/')}`;

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
  };

  const topbar = (
    <section className="topbar" aria-label="Current path and quick links">
      <p className="fs-path topbar-path">{`${rootName}${currentPath || '/'}`}</p>
      <div className="topbar-actions">
        <div className="topbar-socials">
          <a className="topbar-icon-btn" href={content.site.socials.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub"><GithubIcon /></a>
          <a className="topbar-icon-btn" href={content.site.socials.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">in</a>
          <a className="topbar-icon-btn" href={content.site.socials.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram">ig</a>
          <a className="topbar-icon-btn" href={content.site.socials.x} target="_blank" rel="noreferrer noopener" aria-label="X">x</a>
        </div>
        <div className="topbar-utility">
          <button className="theme-toggle topbar-icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={theme === 'dark'}>
            <span className="theme-icon theme-sun" aria-hidden="true">☀</span>
            <span className="theme-icon theme-moon" aria-hidden="true">☾</span>
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className={`site-shell ${isHomeRoute ? 'with-home-bg' : ''}`.trim()}>
      {isHomeRoute ? <HomeBackground /> : null}
      {Glass ? <Glass>{topbar}</Glass> : topbar}
      <aside className="site-sidebar" aria-label="Site navigation">
        <p className="site-sidebar-label">Folders</p>
        <Link className="site-nav-link" to="/">home.md</Link>
        <Link className="site-nav-link" to="/experience/">experience.md</Link>
        <Link className="site-nav-link" to="/thoughts/">thoughts/</Link>
      </aside>
      <main className="page">
        {children}
        <footer className="site-footer" aria-label="Footer">
          <p className="site-footer-credit">{content.site.footer_credit}.</p>
          <a className="site-footer-link" href={content.site.source_url} target="_blank" rel="noreferrer noopener">Source code</a>
        </footer>
      </main>
    </div>
  );
}
