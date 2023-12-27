import Head from 'next/head';
import { SpeedInsights } from '@vercel/speed-insights/next';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Michael Steward</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Homepage for Michael Steward" />
        <meta name="theme-color" content="#317EFB" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>&gt; michael steward</h1>
      </main>
      <SpeedInsights />
    </div>
  );
}
