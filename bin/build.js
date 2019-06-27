#!/usr/bin/env node

const featherIcons = require("feather-icons/dist/icons.json");
const fs = require("fs");
const path = require("path");
const util = require("util");
const parcalCase = require("pascalcase");

const writeFile = util.promisify(fs.writeFile);

const rootDir = path.join(__dirname, "..");

const iconsDir = path.join(rootDir, "./src/icons");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}
let indexContent = "";

const getComponentName = name => {
  switch (name) {
    case 'github':
      return 'GitHub';
    case 'gitlab':
      return 'GitLab';
    default:
      return parcalCase(name)
  }
}

let promises = Object.keys(featherIcons).map(function(name) {
  const componentName = getComponentName(name);
  indexContent += `export { default as ${componentName} } from './icons/${componentName}.svelte';\n`;
  const componentContent = `<svelte:options tag="${name}-icon"/>\n
<script>
  export let color = 'currentColor';
  export let size = 24;
</script>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="{size}"
  height="{size}"
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  >
  ${featherIcons[name]}
</svg>`;
  return writeFile(
    path.join(iconsDir, componentName + ".svelte"),
    componentContent
  );
});
Promise.all(promises).then(function() {
  return writeFile(path.join(rootDir, "src/index.js"), indexContent);
});
