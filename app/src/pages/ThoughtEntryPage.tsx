import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../lib/content';
import { useEntries, useEntryHtml } from '../lib/hooks';

export function ThoughtEntryPage() {
  const { slug = '' } = useParams();
  const entries = useEntries();
  const entry = useMemo(() => entries.find((item) => item.slug === slug), [entries, slug]);
  const html = useEntryHtml(slug) ?? '<p>Unable to load entry.</p>';

  if (!entry) return <p className="empty-message">Entry not found.</p>;

  return (
    <article className="entry">
      <h1 className="entry-title">{entry.title}</h1>
      <p className="entry-meta">{formatDate(entry.date)} · {entry.kind}</p>
      <div className="entry-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
