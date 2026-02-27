import { load } from 'js-yaml';
import { marked } from 'marked';

export type Entry = {
  slug: string;
  path?: string;
  title: string;
  date: string;
  kind: string;
  featured?: boolean;
};

export type SiteContent = {
  site: {
    name: string;
    footer_credit: string;
    source_url: string;
    socials: { github: string; linkedin: string; instagram: string; x: string };
  };
  home: {
    intro_title: string;
    intro_paragraphs: string[];
    experience_label: string;
    experiences: Array<{
      role: string;
      company: string;
      period: string;
      location: string;
      summary: string;
      logo?: { src: string; alt: string };
    }>;
  };
  thoughts: {
    heading: string;
    sort_label: string;
    sort_newest: string;
    sort_oldest: string;
    empty_message: string;
  };
};

let siteCache: SiteContent | null = null;
let entriesCache: Entry[] | null = null;
let entryHtmlCache: Record<string, string> | null = null;

export type AppData = {
  siteContent: SiteContent;
  entries: Entry[];
  entryHtmlBySlug: Record<string, string>;
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  site: {
    name: 'Neil Dandekar',
    footer_credit: 'Built by Neil',
    source_url: 'https://github.com/neildandekar/neil-dandekar.github.io',
    socials: { github: '#', linkedin: '#', instagram: '#', x: '#' }
  },
  home: {
    intro_title: "Hi, I'm Neil.",
    intro_paragraphs: [],
    experience_label: 'Experience',
    experiences: []
  },
  thoughts: {
    heading: 'Thoughts',
    sort_label: 'Sort',
    sort_newest: 'Newest first',
    sort_oldest: 'Oldest first',
    empty_message: 'No entries yet.'
  }
};

export async function loadSiteContent() {
  if (siteCache) return siteCache;
  try {
    const response = await fetch('/content/site.yaml');
    if (!response.ok) throw new Error('Site content missing');
    const source = await response.text();
    siteCache = load(source) as SiteContent;
  } catch {
    siteCache = DEFAULT_SITE_CONTENT;
  }
  return siteCache;
}

export async function loadEntries() {
  if (entriesCache) return entriesCache;
  try {
    const response = await fetch('/content/entries.yaml');
    if (!response.ok) throw new Error('Entry index missing');
    const source = await response.text();
    const parsed = load(source) as { entries: Entry[] };
    entriesCache = parsed.entries ?? [];
  } catch {
    entriesCache = [];
  }
  return entriesCache;
}

async function loadEntryMarkdown(slug: string) {
  const response = await fetch(`/content/${slug}.md`);
  if (!response.ok) throw new Error('Entry not found');
  return response.text();
}

function stripFrontMatter(raw: string) {
  return raw.replace(/^---[\s\S]*?---\s*/, '');
}

async function loadEntryHtmlBySlug(entries: Entry[]) {
  if (entryHtmlCache) return entryHtmlCache;
  const htmlPairs = await Promise.all(
    entries.map(async (entry) => {
      try {
        const markdown = await loadEntryMarkdown(entry.slug);
        const parsed = await Promise.resolve(marked.parse(stripFrontMatter(markdown)));
        return [entry.slug, typeof parsed === 'string' ? parsed : '<p>Unable to render entry.</p>'] as const;
      } catch {
        return [entry.slug, '<p>Unable to load entry.</p>'] as const;
      }
    })
  );
  entryHtmlCache = Object.fromEntries(htmlPairs);
  return entryHtmlCache;
}

export async function loadAppData(): Promise<AppData> {
  const [siteContent, entries] = await Promise.all([loadSiteContent(), loadEntries()]);
  const entryHtmlBySlug = await loadEntryHtmlBySlug(entries);
  return { siteContent, entries, entryHtmlBySlug };
}

export function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
