import { marked } from 'marked';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate, loadEntryMarkdown } from '../lib/content';
import { useEntries } from '../lib/hooks';

export function ThoughtEntryPage() {
  const { slug = '' } = useParams();
  const entries = useEntries();
  const entry = useMemo(() => entries.find((item) => item.slug === slug), [entries, slug]);
  const [html, setHtml] = useState('<p>Loading...</p>');

  useEffect(() => {
    let active = true;
    if (!slug) return;
    loadEntryMarkdown(slug)
      .then((raw) => {
        const content = raw.replace(/^---[\s\S]*?---\s*/, '');
        const parsed = marked.parse(content);
        if (active) setHtml(typeof parsed === 'string' ? parsed : '<p>Unable to render entry.</p>');
      })
      .catch(() => active && setHtml('<p>Unable to load entry.</p>'));
    return () => {
      active = false;
    };
  }, [slug]);

  if (!entry) return <p className="empty-message">Entry not found.</p>;

  return (
    <article className="entry">
      <h1 className="entry-title">{entry.title}</h1>
      <p className="entry-meta">{formatDate(entry.date)} · {entry.kind}</p>
      <div className="entry-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
