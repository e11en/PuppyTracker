// Copy the built panel bundle into the integration's frontend/ dir so HA serves it.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../dist/puppy-tracker-panel.js");
const dest = resolve(
  here,
  "../../custom_components/puppy_tracker/frontend/puppy-tracker-panel.js",
);

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`Copied bundle -> ${dest}`);
