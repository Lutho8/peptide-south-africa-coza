#!/usr/bin/env node
// Post-process src/data/blogPosts.ts to strip Peptiq branding, breadcrumb noise,
// and rewrite image URLs that point at peptiq.io to local placeholders.
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/data/blogPosts.ts');
const src = fs.readFileSync(file, 'utf8');
const marker = src.indexOf('blogPosts: BlogPost[]');
const jsonStart = src.indexOf('[', src.indexOf('=', marker));
const jsonEnd = src.lastIndexOf('];');
const banner = src.slice(0, src.indexOf('\nexport type BlogPost'));
const header = src.slice(src.indexOf('\nexport type BlogPost'), jsonStart);
const posts = JSON.parse(src.slice(jsonStart, jsonEnd + 1));

function cleanContent(md, post) {
  let out = md;
  // Strip leading breadcrumb "[Back to Blog](/blog)..."
  out = out.replace(/^\[Back to Blog\][^\n]*\n*/i, '');
  // Strip the category•date•readTime header line that often duplicates metadata
  out = out.replace(/^[^\n]*•[^\n]*min read[^\n]*\n+/i, '');
  // Strip the title if it appears as the first non-heading line (we render it ourselves)
  if (post.title) {
    const t = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`^${t}\\s*\\n+`), '');
  }
  // Strip "PeptIQ Team" / "PeptIQ" attribution blocks
  out = out.replace(/PeptIQ Team[\s\S]{0,80}?Peptide Research & Education/gi, '');
  out = out.replace(/\b(PeptIQ Team|PeptIQ)\b/g, 'Peptide South Africa Research');
  out = out.replace(/peptiq\.io/gi, 'peptide-south-africa.co.za');
  // Strip trailing "Related articles" / "Share this article" / "Subscribe" blocks
  out = out.split(/\n(?:#+\s*)?(?:Related articles?|Share this article|Subscribe to our newsletter|Continue reading)\b/i)[0];
  // Strip "Back to Blog" trailing link
  out = out.replace(/\[Back to Blog\][^\n]*\n*/gi, '');
  // Collapse blank lines
  out = out.replace(/\n{3,}/g, '\n\n').trim();
  return out;
}

const cleaned = posts.map(p => ({ ...p, contentMd: cleanContent(p.contentMd, p) }));

const ts = `${banner}${header}${JSON.stringify(cleaned, null, 2)};\n`;
fs.writeFileSync(file, ts);
console.log(`Cleaned ${cleaned.length} posts. Avg content length:`,
  Math.round(cleaned.reduce((s, p) => s + p.contentMd.length, 0) / cleaned.length));
