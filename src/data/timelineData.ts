// src/roadmap/timelineData.ts
import type { TimelineSection } from "@site/src/components/CareerTimeline";

const timelineData: TimelineSection[] = [
  {
    id: "foundations",
    title: "Foundations",
    items: [
      { id: "vars", title: "Variables", subtitle: "Primitives vs Reference", url: "/roadmap/java/basics/variables" },
      { id: "arrays", title: "Arrays", subtitle: "Iteration & pitfalls", url: "/roadmap/java/basics/arrays" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      { id: "spring-intro", title: "Spring Boot Intro", subtitle: "REST, DI, Profiles", url: "/roadmap/java/spring-boot/intro", meta: { tags: ["Spring", "REST"] } },
      { id: "testing", title: "Testing", subtitle: "JUnit 5 & Testcontainers", url: "/roadmap/testing" },
    ],
  },
];
export default timelineData;
