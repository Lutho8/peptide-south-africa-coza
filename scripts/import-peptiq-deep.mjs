#!/usr/bin/env node
// Deep importer: for each post in src/data/blogPosts.ts, fetch the article page,
// extract the body, convert to markdown, and re-emit src/data/blogPosts.ts with
// `slug`, `contentMd`, and a normalized shape suitable for internal hosting.
//
// Usage: node scripts/import-peptiq-deep.mjs [--limit=N] [--concurrency=N]
//
// Output rewrites src/data/blogPosts.ts. Existing entries (titles, dates, images,
// categories) are preserved; only `contentMd` is added.

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;
const CONCURRENCY = args.concurrency ? parseInt(args.concurrency, 10) : 8;

// ---- helpers --------------------------------------------------------------

function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#x2F;/g, '/').replace(/&#x60;/g, '`');
}

function stripTagsKeepText(html) {
  return decode(html.replace(/<[^>]+>/g, '')).replace(/\s+\n/g, '\n').trim();
}

// Very small HTML → markdown converter, scoped to article body content.
function htmlToMarkdown(html) {
  let out = html;

  // Drop script/style/svg
  out = out.replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/gi, '');

  // Pull images first — keep src/alt
  out = out.replace(/<img[^>]*?src=\"([^\"]+)\"[^>]*?(?:alt=\"([^\"]*)\")?[^>]*>/gi,
    (_, src, alt = '') => `\n\n![${decode(alt)}](${src})\n\n`);

  // Headings
  for (const n of [1, 2, 3, 4, 5, 6]) {
    out = out.replace(new RegExp(`<h${n}[^>]*>([\s\S]*?)<\/h${n}>`, 'gi'),
      (_, inner) => `\n\n${'#'.repeat(n)} ${stripTagsKeepText(inner)}\n\n`);
  }

  // Links
  out = out.replace(/<a[^>]*?href=\"([^\"]+)\"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, inner) => {
      const text = stripTagsKeepText(inner);
      if (!text) return '';
      return `[${text}](${href})`;
    });

  // Lists
  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => `- ${stripTagsKeepText(m[1])}`).join('\n');
    return `\n\n${items}\n\n`;
  });
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let i = 0;
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => `${++i}. ${stripTagsKeepText(m[1])}`).join('\n');
    return `\n\n${items}\n\n`;
  });

  // Blockquote
  out = out.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
    `\n\n> ${stripTagsKeepText(inner).split('\n').join('\n> ')}\n\n`);

  // Bold / italic / code
  out = out.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `**${stripTagsKeepText(inner)}**`);
  out = out.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `*${stripTagsKeepText(inner)}*`);
  out = out.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => `\`${stripTagsKeepText(inner)}\``);

  // Paragraphs
  out = out.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => `\n\n${stripTagsKeepText(inner)}\n\n`);
  out = out.replace(/<br\s*\/?>/gi, '  \n');

  // hr
  out = out.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // Strip remaining tags
  out = out.replace(/<\/?(div|section|article|main|header|footer|figure|figcaption|span|aside|nav|button|small|time|picture|source|html|body|head|meta|link)[^>]*>/gi, '');
  out = out.replace(/<[^>]+>/g, '');

  // Decode + clean whitespace
  out = decode(out)
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return out;
}

// Extract article body from the Next.js HTML payload.
// Strategy: find the <article> element; fall back to <main>.
function extractArticleHtml(html) {
  const art = html.match(/<article[\s\S]*?<\/article>/i);
  if (art) return art[0];
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  if (main) return main[0];
  return null;
}

// Fix /_next/image proxied URLs back to their origin
function unwrapNextImage(html) {
  return html.replace(/src=\"\/_next\/image\?[^\"]*url=([^\"&]+)[^\"]*\"/g, (_, u) => {
    try { return `src="${decodeURIComponent(u)}"`; } catch { return _; }
  }).replace(/src=\"\/([^\"]+)\"/g, 'src="https://peptiq.io/$1"');
}

// ---- main -----------------------------------------------------------------

async function fetchOne(slug) {
  const url = `https://peptiq.io/blog/${slug}`;
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; RTDBlogImporter/1.0)',
      'accept': 'text/html',
    },
  });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const html = await res.text();
  const body = extractArticleHtml(html);
  if (!body) return { contentMd: '' };
  const md = htmlToMarkdown(unwrapNextImage(body));
  return { contentMd: md };
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  let done = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      try {
        out[i] = await fn(items[i], i);
      } catch (e) {
        out[i] = { error: e.message };
      }
      done++;
      if (done % 10 === 0 || done === items.length) {
        process.stdout.write(`\r  fetched ${done}/${items.length}`);
      }
    }
  }));
  process.stdout.write('\n');
  return out;
}

const blogFile = path.resolve('src/data/blogPosts.ts');
const src = fs.readFileSync(blogFile, 'utf8');
const marker = src.indexOf('blogPosts');
const jsonStart = src.indexOf('[', marker);
const jsonEnd = src.lastIndexOf('];');
const posts = JSON.parse(src.slice(jsonStart, jsonEnd + 1));

const targets = posts.slice(0, LIMIT);
console.log(`Fetching ${targets.length} articles (concurrency=${CONCURRENCY})...`);

const results = await pool(targets, CONCURRENCY, async (p) => {
  const r = await fetchOne(p.id);
  return { ...p, slug: p.id, contentMd: r.contentMd };
});

// Merge back into posts (keep any tail untouched if --limit was used)
const merged = posts.map((p, i) => {
  const r = results[i];
  if (!r || r.error) {
    return { ...p, slug: p.id, contentMd: '' };
  }
  return r;
});

// Drop the old `url` field — internal pages now own the canonical URL.
const out = merged.map(({ url: _url, ...rest }) => rest);

const banner = `// AUTO-GENERATED from peptiq.io/blog by scripts/import-peptiq-deep.mjs
// ${out.length} posts. Internally hosted at /blog/<slug>.
// Re-run: node scripts/import-peptiq-deep.mjs
`;

const ts = `${banner}
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  contentMd: string;
  featured?: boolean;
};

export const blogPosts: BlogPost[] = ${JSON.stringify(out, null, 2)};
`;

fs.writeFileSync(blogFile, ts);
const withContent = out.filter(p => p.contentMd && p.contentMd.length > 200).length;
console.log(`Wrote ${out.length} posts (${withContent} with full content) to ${blogFile}`);
