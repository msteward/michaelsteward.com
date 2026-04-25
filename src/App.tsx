import { useEffect, useState } from 'react';
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
  });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
  return { time, tz };
}

export default function App() {
  const { time, tz } = useClock();
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <header className={styles.statusbar}>
        <div className={styles.left}>
          <span className={styles.dot} aria-hidden />
          <span>session · michaelsteward.com</span>
        </div>
        <div className={styles.right}>
          <span>{tz.replace('_', ' ')}</span>
          <span aria-hidden>·</span>
          <span>{time}</span>
        </div>
      </header>

      <main className={styles.main}>
        <span className={styles.eyebrow}>~ / personal site / v2</span>

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
            <span className={styles.key}>status</span>
            <span className={styles.val}>
              <em>online</em>, building &amp; tinkering
            </span>
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
        <span className={styles.ascii}>{'< / >'}</span>
        <span>built quietly</span>
      </footer>
    </div>
  );
}
