import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LiquidGlass from 'liquid-glass-react';
import { useSiteContent } from '../lib/hooks';
import { HomeBackground } from './HomeBackground';

const THEME_KEY = 'nd-theme';
type ThemeMode = 'light' | 'dark';
type GlassPreset = Omit<
  React.ComponentProps<typeof LiquidGlass>,
  'children' | 'className' | 'style' | 'padding' | 'cornerRadius'
>;

const GLASS_PRESETS: Record<ThemeMode, { container: GlassPreset; social: GlassPreset }> = {
  light: {
    container: {
      displacementScale: 42,
      blurAmount: 11,
      saturation: 138,
      aberrationIntensity: 1.4,
      elasticity: 0.24,
      overLight: true,
      mode: 'standard'
    },
    social: {
      displacementScale: 56,
      blurAmount: 14,
      saturation: 130,
      aberrationIntensity: 1.8,
      elasticity: 0.32,
      overLight: true,
      mode: 'prominent'
    }
  },
  dark: {
    container: {
      displacementScale: 38,
      blurAmount: 13,
      saturation: 120,
      aberrationIntensity: 1.6,
      elasticity: 0.24,
      overLight: false,
      mode: 'standard'
    },
    social: {
      displacementScale: 52,
      blurAmount: 16,
      saturation: 112,
      aberrationIntensity: 2,
      elasticity: 0.32,
      overLight: false,
      mode: 'prominent'
    }
  }
};

function initialTheme(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function GithubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.77.6-3.35-1.17-3.35-1.17-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.9 1.53 2.35 1.09 2.92.83.09-.64.35-1.09.63-1.34-2.21-.25-4.53-1.1-4.53-4.91 0-1.09.39-1.98 1.02-2.67-.1-.25-.44-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.8c.85 0 1.71.11 2.51.32 1.91-1.29 2.74-1.02 2.74-1.02.55 1.37.21 2.39.11 2.64.64.69 1.02 1.58 1.02 2.67 0 3.82-2.32 4.66-4.54 4.9.36.31.67.92.67 1.86v2.84c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
}

function LinkedinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56A1.94 1.94 0 1 0 3.3 4.94a1.94 1.94 0 0 0 3.86 0ZM20.7 13.2c0-3.06-1.63-4.48-3.8-4.48-1.75 0-2.54.96-2.98 1.64V8.5h-3.38V20h3.38v-6.38c0-.34.03-.68.13-.93.27-.68.88-1.38 1.9-1.38 1.35 0 1.9 1.03 1.9 2.55V20h3.38v-6.8Z" /></svg>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.3" cy="6.8" r="1.2" /></svg>;
}

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 4h4.3l3.07 4.34L16.58 4h2.1l-5.08 5.78L19.3 20H15l-3.3-4.67L7.62 20h-2.1l5.15-5.87L5.3 4Z" /></svg>;
}

function SocialLink({
  href,
  label,
  preset,
  children
}: {
  href: string;
  label: string;
  preset: GlassPreset;
  children: React.ReactNode;
}) {
  return (
    <a className="topbar-icon-link" href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
      <LiquidGlass
        {...preset}
        className="topbar-icon-glass glass-fallback glass-social"
        style={{ width: '2.9rem', height: '2.9rem' }}
        cornerRadius={999}
        padding="0"
      >
        <span className="social-icon-inner">{children}</span>
      </LiquidGlass>
    </a>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const content = useSiteContent();
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const isHomeRoute = location.pathname === '/';
  const presets = GLASS_PRESETS[theme];

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
          <SocialLink href={content.site.socials.github} label="GitHub" preset={presets.social}>
            <GithubIcon />
          </SocialLink>
          <SocialLink href={content.site.socials.linkedin} label="LinkedIn" preset={presets.social}>
            <LinkedinIcon />
          </SocialLink>
          <SocialLink href={content.site.socials.instagram} label="Instagram" preset={presets.social}>
            <InstagramIcon />
          </SocialLink>
          <SocialLink href={content.site.socials.x} label="X" preset={presets.social}>
            <XIcon />
          </SocialLink>
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
      <LiquidGlass
        {...presets.container}
        className="topbar-glass glass-fallback glass-container"
        style={{ width: '100%' }}
        cornerRadius={12}
        padding="0"
      >
        {topbar}
      </LiquidGlass>
      <LiquidGlass
        {...presets.container}
        className="site-sidebar-glass glass-fallback glass-container"
        style={{ width: '100%' }}
        cornerRadius={12}
        padding="0"
      >
        <aside className="site-sidebar" aria-label="Site navigation">
          <p className="site-sidebar-label">Folders</p>
          <Link className="site-nav-link" to="/">home.md</Link>
          <Link className="site-nav-link" to="/experience/">experience.md</Link>
          <Link className="site-nav-link" to="/thoughts/">thoughts/</Link>
        </aside>
      </LiquidGlass>
      <main className="page">
        {children}
        <LiquidGlass
          {...presets.container}
          className="site-footer-glass glass-fallback glass-container"
          cornerRadius={12}
          padding="0"
        >
          <footer className="site-footer" aria-label="Footer">
            <p className="site-footer-credit">{content.site.footer_credit}.</p>
            <a className="site-footer-link" href={content.site.source_url} target="_blank" rel="noreferrer noopener">Source code</a>
          </footer>
        </LiquidGlass>
      </main>
    </div>
  );
}
