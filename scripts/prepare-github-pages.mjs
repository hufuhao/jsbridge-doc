import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputRoot = fileURLToPath(new URL("../dist/client/", import.meta.url));
const pagesBasePath = (process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "").replace(/^\/+/, "");
const nextAssets = join(outputRoot, pagesBasePath, "_next");
const publicAssets = join(outputRoot, "assets");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".rsc", ".txt"]);

await rename(nextAssets, publicAssets);

async function rewriteAssetPaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteAssetPaths(path);
      return;
    }
    if (!textExtensions.has(extname(entry.name))) return;

    const source = await readFile(path, "utf8");
    const updated = source.replaceAll("/_next/", "/assets/");
    if (updated !== source) await writeFile(path, updated);
  }));
}

await rewriteAssetPaths(outputRoot);
