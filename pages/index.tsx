import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Michael Steward</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Homepage for Michael Steward" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          &gt; michael steward
        </h1>
      </main>
    </div>
  )
}
