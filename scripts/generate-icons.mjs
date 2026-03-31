import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [sourcePath, outputDir = "public"] = process.argv.slice(2);

if (!sourcePath) {
  console.error("Usage: node scripts/generate-icons.mjs <source-png> [output-dir]");
  process.exit(1);
}

const resolvedSourcePath = path.resolve(sourcePath);
const resolvedOutputDir = path.resolve(outputDir);

mkdirSync(resolvedOutputDir, { recursive: true });

const sourceBase64 = readFileSync(resolvedSourcePath).toString("base64");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="88" y1="84" x2="924" y2="948" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#071A3A"/>
      <stop offset="0.54" stop-color="#0A2956"/>
      <stop offset="1" stop-color="#0A5379"/>
    </linearGradient>
    <radialGradient id="cyanGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(781 259) rotate(90) scale(319)">
      <stop stop-color="#22E3FF" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#22E3FF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="roseGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(234 768) rotate(90) scale(288)">
      <stop stop-color="#F472B6" stop-opacity="0.46"/>
      <stop offset="1" stop-color="#F472B6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="146" y1="138" x2="902" y2="908" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.15"/>
      <stop offset="1" stop-color="white" stop-opacity="0.03"/>
    </linearGradient>
    <linearGradient id="highlight" x1="512" y1="138" x2="512" y2="346" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.24"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <filter id="blur-80" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="42"/>
    </filter>
    <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="170%">
      <feDropShadow dx="0" dy="28" stdDeviation="26" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
  </defs>

  <rect width="1024" height="1024" rx="248" fill="url(#bg)"/>
  <circle cx="781" cy="259" r="220" fill="url(#cyanGlow)" filter="url(#blur-80)"/>
  <circle cx="234" cy="768" r="196" fill="url(#roseGlow)" filter="url(#blur-80)"/>
  <rect x="72" y="72" width="880" height="880" rx="220" fill="url(#glass)" fill-opacity="0.92" stroke="white" stroke-opacity="0.12" stroke-width="2"/>
  <rect x="120" y="112" width="784" height="170" rx="130" fill="url(#highlight)"/>
  <image href="data:image/png;base64,${sourceBase64}" x="-323" y="74" width="1670" height="912" preserveAspectRatio="xMidYMid meet" filter="url(#logo-shadow)"/>
</svg>
`;

const files = {
  templateSvg: path.join(resolvedOutputDir, "favicon.svg")
};

writeFileSync(files.templateSvg, svg);
