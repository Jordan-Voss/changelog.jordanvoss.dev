import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/roadmap/intro">
            View My Developer Roadmap 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Follow my journey to becoming a Senior Developer. Learn from what I learn.">
      <HomepageHeader />
      <main className={styles.main}>
        <section className={styles.introSection}>
          <h2>What You'll Find Here</h2>
          <ul>
            <li>📘 A public roadmap of my developer journey</li>
            <li>✍️ Weekly blog posts on what I’m learning</li>
            <li>🔗 Curated resources, tools, and guides</li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}