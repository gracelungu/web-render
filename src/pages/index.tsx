import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Web Render</title>
        <meta name="description" content="Web Render" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Web Render
            <code className={styles.code}>src/pages/index.tsx</code>
          </p>
        </div>

      </main>
    </>
  )
}
