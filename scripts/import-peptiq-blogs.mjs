#!/usr/bin/env node
// One-off import: parses peptiq.io/blog into src/data/blogPosts.ts
import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('/tmp/peptiq.html', 'utf8');

// Each article card on the page renders as an <a href="/blog/<slug>"> wrapping an <img>
// with title in alt + a category / date / readTime block + a description paragraph.
// Strategy: find all anchors that point to /blog/<slug> (single-segment), then for
// each unique slug, look at the surrounding HTML for the metadata.

const slugRe = /href="\/blog\/([a-z0-9][a-z0-9-]+)"/g;
const slugs = new Set();
let m;
while ((m = slugRe.exec(html)) !== null) {
  const s = m[1];
  if (s === 'category') continue;
  slugs.add(s);
}

// For each slug, find the first occurrence in HTML; capture a window around it.
const posts = [];
for (const slug of slugs) {
  const idx = html.indexOf(`/blog/${slug}"`);
  if (idx < 0) continue;
  // Walk back to find the start of the enclosing <a> (or <article>)
  const start = Math.max(0, html.lastIndexOf('<a ', idx));
  // Walk forward to closing </a>
  const endRel = html.indexOf('</a>', idx);
  const end = endRel < 0 ? Math.min(html.length, idx + 4000) : endRel + 4;
  const block = html.slice(start, end);

  // Title from <img alt="...">
  const altMatch = block.match(/<img[^>]+alt="([^"]+)"/);
  const title = altMatch ? altMatch[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : slug;

  // Image src
  const imgMatch = block.match(/<img[^>]+src="([^"]+)"/);
  let image = imgMatch ? imgMatch[1] : '';
  if (image.startsWith('/_next/image')) {
    // Decode url param
    try {
      const u = new URL('https://peptiq.io' + image);
      const real = u.searchParams.get('url');
      if (real) image = decodeURIComponent(real);
    } catch {}
  } else if (image.startsWith('/')) {
    image = 'https://peptiq.io' + image;
  }

  // Find text in the block — strip tags, collapse
  const text = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Pattern: "<category>•<date>•<n> min read <Title> <Excerpt> Read article"
  // or "<category>•<n> min read <Title> <Excerpt>"
  let category = '';
  let date = '';
  let readTime = '';
  let excerpt = '';

  const meta = text.match(/^([^•]+?)•\s*([^•]+?)\s*•\s*(\d+\s*min\s*read)/i);
  const meta2 = text.match(/^([^•]+?)•\s*(\d+\s*min\s*read)/i);
  let afterMeta = text;
  if (meta) {
    category = meta[1].trim();
    date = meta[2].trim();
    readTime = meta[3].trim();
    afterMeta = text.slice(meta[0].length).trim();
  } else if (meta2) {
    category = meta2[1].trim();
    readTime = meta2[2].trim();
    afterMeta = text.slice(meta2[0].length).trim();
  }

  // Excerpt: strip the title prefix if present, drop trailing "Read article"
  if (afterMeta.startsWith(title)) afterMeta = afterMeta.slice(title.length).trim();
  excerpt = afterMeta.replace(/Read article\s*$/i, '').trim();
  if (excerpt.length > 320) excerpt = excerpt.slice(0, 317).trim() + '…';

  // ISO date
  let isoDate = '';
  if (date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) isoDate = d.toISOString().slice(0, 10);
  }

  posts.push({
    id: slug,
    title,
    excerpt,
    category: category || 'Research',
    date: isoDate,
    readTime: readTime || '',
    url: `https://peptiq.io/blog/${slug}`,
    image,
  });
}

// Sort by date desc (empty dates last)
posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

// Mark first 3 as featured
posts.slice(0, 3).forEach(p => (p.featured = true));

const banner = `// AUTO-GENERATED from peptiq.io/blog by scripts/import-peptiq-blogs.mjs\n// ${posts.length} posts. Do not edit manually — re-run the importer to refresh.\n`;

const ts = `${banner}
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  url: string;
  image: string;
  featured?: boolean;
};

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;

const out = path.resolve('src/data/blogPosts.ts');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, ts);
console.log(`Wrote ${posts.length} posts to ${out}`);
