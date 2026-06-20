// Generates public/sitemap.xml. Runs via predev/prebuild hooks.
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://peptide-south-africa.co.za";


type Entry = { path: string; changefreq?: string; priority?: string; lastmod?: string };

const staticEntries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/free-course", changefreq: "monthly", priority: "0.8" },
  { path: "/live-qna", changefreq: "monthly", priority: "0.6" },
  { path: "/coa-verification", changefreq: "monthly", priority: "0.5" },
  { path: "/bloodwork", changefreq: "monthly", priority: "0.8" },
  { path: "/cycles", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
];

const peptides = [
  "bpc-157","tb-500","retatrutide","tirzepatide","ipamorelin","cjc-1295",
  "ghk-cu","epitalon","ss-31","semax","selank","thymosin-alpha-1",
  "pt-141","dsip","semaglutide",
];

const categories = [
  "healing","weight-loss","longevity","cognitive","immune",
  "growth-hormone","skin-hair","hormonal","metabolic",
];

const guides = ["reconstitution","injection","bloodwork"];

// Read blog post slugs from the static data file.
function readBlogSlugs(): { slug: string; date: string }[] {
  try {
    const src = readFileSync(resolve("src/data/blogPosts.ts"), "utf8");
    const marker = src.indexOf("blogPosts: BlogPost[]");
    const start = src.indexOf("[", src.indexOf("=", marker));
    const end = src.lastIndexOf("];");
    const arr = JSON.parse(src.slice(start, end + 1)) as { slug: string; id: string; date: string }[];
    return arr.map(p => ({ slug: p.slug || p.id, date: p.date }));
  } catch (e) {
    console.warn("sitemap: could not read blog posts:", (e as Error).message);
    return [];
  }
}

const blogPosts = readBlogSlugs();

const entries: Entry[] = [
  ...staticEntries,
  ...peptides.map((s) => ({ path: `/peptides/${s}`, changefreq: "monthly", priority: "0.9" })),
  ...categories.map((s) => ({ path: `/categories/${s}`, changefreq: "monthly", priority: "0.8" })),
  ...guides.map((s) => ({ path: `/guides/${s}`, changefreq: "monthly", priority: "0.9" })),
  ...blogPosts.map(p => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: p.date || undefined,
  })),
];

const lastmod = new Date().toISOString().slice(0, 10);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries, lastmod=${lastmod})`);
