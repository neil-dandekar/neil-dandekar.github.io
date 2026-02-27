import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/content';
import { useEntries, useSiteContent } from '../lib/hooks';

export function ThoughtsPage() {
  const content = useSiteContent();
  const entries = useEntries();
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('modified-desc');

  const tags = useMemo(() => Array.from(new Set(entries.map((entry) => entry.kind).filter(Boolean))).sort(), [entries]);

  const visible = useMemo(() => {
    const filtered = tag ? entries.filter((entry) => entry.kind === tag) : [...entries];
    filtered.sort((a, b) => {
      const aTime = new Date(`${a.date}T00:00:00`).getTime();
      const bTime = new Date(`${b.date}T00:00:00`).getTime();
      if (sort === 'modified-asc') return aTime - bTime;
      if (sort === 'modified-desc') return bTime - aTime;
      if (sort === 'tag-asc') return a.kind.localeCompare(b.kind) || bTime - aTime;
      return b.kind.localeCompare(a.kind) || aTime - bTime;
    });
    return filtered;
  }, [entries, sort, tag]);

  return (
    <section className="finder-main" aria-label="Thoughts folder view">
      <div className="finder-toolbar">
        <p className="section-label finder-heading">{content?.thoughts.heading ?? 'Thoughts'}</p>
        <div className="finder-tools">
          <label className="sort-wrap" htmlFor="tagSelect">
            <span>Tag</span>
            <select id="tagSelect" value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="">All tags</option>
              {tags.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
            </select>
          </label>
          <label className="sort-wrap" htmlFor="sortSelect">
            <span>{content?.thoughts.sort_label ?? 'Sort'}</span>
            <select id="sortSelect" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="modified-desc">{content?.thoughts.sort_newest ?? 'Newest first'}</option>
              <option value="modified-asc">{content?.thoughts.sort_oldest ?? 'Oldest first'}</option>
              <option value="tag-asc">Tag (A-Z)</option>
              <option value="tag-desc">Tag (Z-A)</option>
            </select>
          </label>
        </div>
      </div>
      <div className="finder-column-head" aria-hidden="true"><span>Name</span><span>Tag</span><span>Modified</span></div>
      <ul className="finder-list entry-list">
        {visible.length ? visible.map((entry) => (
          <li className="finder-row" key={entry.slug}>
            <span className="finder-name"><Link className="entry-link finder-file-link" to={`/thoughts/${entry.slug}/`}>{entry.title}</Link></span>
            <span className="finder-kind">{entry.kind || '—'}</span>
            <span className="finder-date">{formatDate(entry.date)}</span>
          </li>
        )) : <li className="empty-message">{content?.thoughts.empty_message ?? 'No entries yet.'}</li>}
      </ul>
    </section>
  );
}
