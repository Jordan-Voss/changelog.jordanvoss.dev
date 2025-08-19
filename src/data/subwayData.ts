// src/roadmap/subwayData.ts
import type { SubwayMapData } from "@site/src/components/SubwayMap";

const subwayData: SubwayMapData = {
  grid: { cols: 14, rows: 8, cell: 72 },
  stops: [
    { id: "java", title: "Java", url: "/roadmap/java", x: 1, y: 2 },
    { id: "basics", title: "Basics", url: "/roadmap/java/basics", x: 3, y: 2 },
    { id: "variables", title: "Variables", url: "/roadmap/java/basics/variables", x: 5, y: 2 },
    { id: "arrays", title: "Arrays", url: "/roadmap/java/basics/arrays", x: 7, y: 2 },
    { id: "spring", title: "Spring Boot", url: "/roadmap/java/spring-boot", x: 9, y: 3 },
    { id: "testing", title: "Testing", url: "/roadmap/testing", x: 11, y: 4 },
  ],
  lines: [
    { id: "l1", name: "Core Java", stops: ["java", "basics", "variables", "arrays"] },
    { id: "l2", name: "Backend", stops: ["java", "spring", "testing"] },
  ],
};
export default subwayData;
