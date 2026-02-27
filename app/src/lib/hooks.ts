import { useEffect, useState } from 'react';
import { Entry, SiteContent, loadEntries, loadSiteContent } from './content';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  useEffect(() => {
    loadSiteContent().then(setContent).catch(() => setContent(null));
  }, []);
  return content;
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => {
    loadEntries().then(setEntries).catch(() => setEntries([]));
  }, []);
  return entries;
}
