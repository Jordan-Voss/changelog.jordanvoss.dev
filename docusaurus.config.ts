import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'My Dev Journey',
  tagline: 'Becoming a Senior Developer, One Step at a Time',
  favicon: 'img/favicon.ico',
  url: 'https://changelog.jordanvoss.dev',
  baseUrl: '/',
  organizationName: 'jordanvoss',
  projectName: 'dev-journey-site',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  future: {
    v4: true,
  },
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/jordanvoss/dev-journey-site/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/jordanvoss/dev-journey-site/edit/main/',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'My Dev Journey',
      logo: {
        alt: 'My Logo',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Roadmap',
        // },
        // { to: '/blog', label: 'Blog', position: 'left' },
        // {
        //   href: 'https://github.com/jordanvoss/dev-journey-site',
        //   label: 'GitHub',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            { label: 'Roadmap', to: '/roadmap' },
            { label: 'Blog', to: '/blog' },
          ],
        },
        {
          title: 'Social',
          items: [
            { label: 'GitHub', href: 'https://github.com/jordanvoss' },
            { label: 'Twitter', href: 'https://twitter.com/yourhandle' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jordan Voss. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;