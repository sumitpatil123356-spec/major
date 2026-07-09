import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const srcDir = "c:/Users/sumit/Desktop/project/src";

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else {
      const ext = path.extname(file);
      if (ext === ".tsx" || (ext === ".ts" && !file.endsWith(".gen.ts"))) {
        const isTsx = ext === ".tsx";
        const newExt = isTsx ? ".jsx" : ".js";
        const newPath = fullPath.slice(0, -ext.length) + newExt;

        console.log(`Converting ${fullPath} -> ${newPath}`);
        try {
          execSync(`npx detype "${fullPath}" "${newPath}"`, { stdio: "inherit" });
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error(`Failed to convert ${fullPath}:`, e.message);
        }
      }
    }
  }
}

try {
  processDir(srcDir);
  console.log("Conversion completed successfully!");
} catch (err) {
  console.error("Error during conversion:", err);
}
