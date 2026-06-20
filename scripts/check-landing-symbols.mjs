#!/usr/bin/env node
/**
 * Pre-build check: ensures every JSX component referenced in
 * src/components/landing/LandingPage.tsx is imported or locally defined.
 *
 * Catches the "HowItWorks is not defined" class of runtime errors at build time.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve('src/components/landing/LandingPage.tsx');
const src = readFileSync(FILE, 'utf8');

// Collect identifiers brought into scope by imports / local declarations.
const inScope = new Set([
  // React intrinsics & common globals used in JSX-as-control-flow
  'Suspense', 'Fragment',
]);

// import { A, B as C } from '...'
for (const m of src.matchAll(/import\s+(?:type\s+)?(?:([A-Za-z_$][\w$]*)\s*,\s*)?\{([^}]+)\}\s+from/g)) {
  if (m[1]) inScope.add(m[1]);
  for (const part of m[2].split(',')) {
    const name = part.trim().split(/\s+as\s+/).pop();
    if (name) inScope.add(name.replace(/[^A-Za-z0-9_$]/g, ''));
  }
}
// import Default from '...'
for (const m of src.matchAll(/import\s+([A-Za-z_$][\w$]*)\s+from/g)) inScope.add(m[1]);
// const X = lazy(...) / const X = ... / function X(...) / class X
for (const m of src.matchAll(/(?:const|let|var)\s+([A-Z][\w$]*)\s*=/g)) inScope.add(m[1]);
for (const m of src.matchAll(/function\s+([A-Z][\w$]*)\s*\(/g)) inScope.add(m[1]);
for (const m of src.matchAll(/class\s+([A-Z][\w$]*)\s*[\{<]/g)) inScope.add(m[1]);

// Find every JSX opening tag with a capitalised name: <Foo ...> / <Foo.Bar
const used = new Set();
for (const m of src.matchAll(/<\s*([A-Z][\w$]*)\b/g)) {
  used.add(m[1].split('.')[0]);
}

const missing = [...used].filter(name => !inScope.has(name));

if (missing.length) {
  console.error('\n✖ check-landing-symbols: undefined component(s) in LandingPage.tsx:');
  for (const name of missing) {
    const lines = src.split('\n');
    const lineNo = lines.findIndex(l => new RegExp(`<\\s*${name}\\b`).test(l)) + 1;
    console.error(`  - <${name}> (line ${lineNo}) — not imported or defined`);
  }
  console.error('\nFix: import the component or remove the reference.\n');
  process.exit(1);
}

console.log(`✓ check-landing-symbols: all ${used.size} JSX components resolved.`);
