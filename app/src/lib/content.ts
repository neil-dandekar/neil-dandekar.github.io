import { load } from 'js-yaml';

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

export async function loadSiteContent() {
  if (siteCache) return siteCache;
  const response = await fetch('/content/site.yaml');
  const source = await response.text();
  siteCache = load(source) as SiteContent;
  return siteCache;
}

export async function loadEntries() {
  if (entriesCache) return entriesCache;
  const response = await fetch('/content/entries.yaml');
  const source = await response.text();
  const parsed = load(source) as { entries: Entry[] };
  entriesCache = parsed.entries ?? [];
  return entriesCache;
}

export async function loadEntryMarkdown(slug: string) {
  const response = await fetch(`/content/${slug}.md`);
  if (!response.ok) throw new Error('Entry not found');
  return response.text();
}

export function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
