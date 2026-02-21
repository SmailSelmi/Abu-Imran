const fs = require("fs");
const path = require("path");

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes("node_modules") && !fullPath.includes(".next")) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      const original = content;

      content = content
        // left/right margins
        .replace(/\bml-(\w+)\b/g, "ms-$1")
        .replace(/\bmr-(\w+)\b/g, "me-$1")
        // left/right padding
        .replace(/\bpl-(\w+)\b/g, "ps-$1")
        .replace(/\bpr-(\w+)\b/g, "pe-$1")
        // text align
        .replace(/\btext-left\b/g, "text-start")
        .replace(/\btext-right\b/g, "text-end")
        // absolute positioning (caution: might need manual check, but generally safe in UI)
        .replace(/\bleft-(\w+|\[.*?\])\b/g, "start-$1")
        .replace(/\bright-(\w+|\[.*?\])\b/g, "end-$1")
        // borders
        .replace(/\bborder-l\b/g, "border-s")
        .replace(/\bborder-r\b/g, "border-e")
        .replace(/\bborder-l-(\w+)\b/g, "border-s-$1")
        .replace(/\bborder-r-(\w+)\b/g, "border-e-$1")
        // rounded corners
        .replace(/\brounded-l-(\w+)\b/g, "rounded-s-$1")
        .replace(/\brounded-r-(\w+)\b/g, "rounded-e-$1");

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated RTL properties in ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, "..", "components"));
processDir(path.join(__dirname, "..", "app"));
