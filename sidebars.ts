import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    { type: 'doc', id: 'intro' },

    {
      type: 'doc',
      id: 'roadmap/roadmap-index',
    },

    {
      type: 'category',
      label: 'Roadmap Topics',
      link: {
        type: 'generated-index',
        title: 'Roadmap Topics',
        description: 'Explore backend development topics like Java, Spring, and Microservices.',
      },
      items: [
        {
          type: 'category',
          label: 'Java',
          link: { type: 'doc', id: 'roadmap/java/roadmap-java-index' },
          items: [
            {
              type: 'category',
              label: 'Basics',
              link: { type: 'doc', id: 'roadmap/java/basics/roadmap-java-basics' },
              items: [
                {
                  type: 'category',
                  label: 'Variables and Data Types',
                  link: { type: 'doc', id: 'roadmap/java/basics/variables/variables-data-types' },
                  items: [
                    'roadmap/java/basics/variables/variable-naming',
                    'roadmap/java/basics/variables/variable-modifiers',
                    'roadmap/java/basics/variables/variable-scope',                  ],
                },
                'roadmap/java/basics/strings-methods',
                'roadmap/java/basics/operations',
                'roadmap/java/basics/loops',
                'roadmap/java/basics/conditionals',
                'roadmap/java/basics/arrays',
                'roadmap/java/basics/memory',
              ],
            },
            {
              type: 'category',
              label: 'Spring Boot',
              link: { type: 'doc', id: 'roadmap/java/springboot/roadmap-springboot' },
              items: [],
            },
          ],
        },
        {
          type: 'category',
          label: 'Microservices',
          link: { type: 'doc', id: 'roadmap/microservices' },
          items: [],
        },
      ],
      } 
,
    {
      type: 'category',
      label: 'Projects',
      link: { type: 'generated-index', title: 'Projects' },
      items: [
        {
          type: 'category',
          label: '🗃️ Organiser App',
          link: { type: 'generated-index', title: 'Organiser App' },
          items: [
            'projects/organiser/overview',
            'projects/organiser/roadmap/project-roadmap-index',
            {
              type: 'category',
              label: 'Roadmap Topics',
              link: { type: 'generated-index', title: 'Organiser App Roadmap Topics' },
              items: [
                'projects/organiser/roadmap/java',
                'projects/organiser/roadmap/spring',
                'projects/organiser/roadmap/microservices',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'glossary/glossary',
      label: 'Glossary',
    }
    
    
  ],
};

export default sidebars;
