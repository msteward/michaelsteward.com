import styles from './Home.module.css';

export default function App() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>&gt; michael steward</h1>
      <nav className={styles.links}>
        <a
          href="https://www.linkedin.com/in/stewardm/"
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin
        </a>
      </nav>
    </main>
  );
}
