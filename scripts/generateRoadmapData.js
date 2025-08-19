const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "docs", "roadmap", "java"); // 👈 only roadmap

function readDir(dir, base = "") {
  return fs.readdirSync(dir).map((name) => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      return {
        type: "folder",
        name,
        path: path.join(base, name),
        children: readDir(full, path.join(base, name)),
      };
    } else if (name.endsWith(".md") || name.endsWith(".mdx")) {
      return {
        type: "file",
        name: name.replace(/\.(md|mdx)$/, ""),
        path: path.join(base, name),
      };
    }
    return null;
  }).filter(Boolean);
}

const data = readDir(DOCS_DIR);
fs.writeFileSync(path.join(__dirname, "..", "src", "data", "roadmapData.json"), JSON.stringify(data, null, 2));
console.log("✅ Roadmap data generated from docs/roadmap!");
