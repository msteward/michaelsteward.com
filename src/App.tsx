import { useEffect, useState, useCallback } from 'react';
import styles from './Home.module.css';

type LinkItem = {
  label: string;
  target: string;
  href: string;
  external?: string;
};

const links: LinkItem[] = [
  {
    label: 'linkedin',
    target: '/in/stewardm',
    href: 'https://www.linkedin.com/in/stewardm/',
    external: 'linkedin.com ↗',
  },
  {
    label: 'email',
    target: 'stewardm@gmail.com',
    href: 'mailto:stewardm@gmail.com',
    external: 'mail ↗',
  },
];

const LOCATION = 'Vancouver, Canada';
const TIMEZONE = 'America/Vancouver';

type Theme = 'light' | 'dark';

function readInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
  }
  return 'dark';
}

function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // localStorage may be unavailable; attribute is still set in-memory
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem('theme');
      } catch {
        stored = null;
      }
      if (stored === 'light' || stored === 'dark') return;
      const next: Theme = e.matches ? 'dark' : 'light';
      setThemeState(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return { theme, setTheme };
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIMEZONE,
  });
  return { time };
}

function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (next: Theme) => void;
}) {
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={() => setTheme(next)}
      aria-label="Toggle color scheme"
      aria-pressed={theme === 'dark'}
    >
      <span className={theme === 'light' ? styles.themeActive : styles.themeInactive}>
        {theme === 'light' ? '[ light ]' : 'light'}
      </span>{' '}
      <span className={theme === 'dark' ? styles.themeActive : styles.themeInactive}>
        {theme === 'dark' ? '[ dark ]' : 'dark'}
      </span>
    </button>
  );
}

export default function App() {
  const { time } = useClock();
  const { theme, setTheme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <header className={styles.statusbar}>
        <div className={styles.left}>
          <span className={styles.dot} aria-hidden />
          <span>michaelsteward.com</span>
        </div>
        <div className={styles.right}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <span aria-hidden>·</span>
          <span>{LOCATION}</span>
          <span aria-hidden>·</span>
          <span>{time}</span>
        </div>
      </header>

      <main className={styles.main}>
        <span className={styles.eyebrow}>~ / personal site</span>

        <h1 className={styles.name}>
          Michael <span className={styles.last}>Steward</span>
          <span className={styles.caret} aria-hidden />
        </h1>

        <section className={styles.whoami} aria-label="about">
          <div className={styles.row}>
            <span className={styles.key}>handle</span>
            <span className={styles.val}>stewardm</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>note</span>
            <span className={styles.val}>
              this page is intentionally small. the rest lives elsewhere.
            </span>
          </div>
        </section>

        <ul className={styles.links}>
          {links.map((link) => {
            const isExternal = link.href.startsWith('http');
            return (
              <li key={link.label}>
                <a
                  className={styles.link}
                  href={link.href}
                  {...(isExternal
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                  <span className={styles.label}>{link.label}</span>
                  <span className={styles.target}>{link.target}</span>
                  {link.external && (
                    <span className={styles.external}>{link.external}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className={styles.footer}>
        <span>© {year} michael steward</span>
        <span className={styles.ascii}>{'< / >'}</span>
        <span>built quietly</span>
      </footer>
    </div>
  );
}
