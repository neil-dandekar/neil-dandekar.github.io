import { Link } from 'react-router-dom';
import { formatDate } from '../lib/content';
import { useEntries, useSiteContent } from '../lib/hooks';

export function HomePage() {
  const content = useSiteContent();
  const entries = useEntries();
  const featured = entries.filter((entry) => entry.featured).slice(0, 6);

  return (
    <>
      <section className="home-intro">
        <h1 className="home-intro-title">{content?.home.intro_title ?? 'Hi, I\'m Neil.'}</h1>
        {(content?.home.intro_paragraphs ?? []).filter(Boolean).map((paragraph) => (
          <p key={paragraph} className="home-intro-text">{paragraph}</p>
        ))}
      </section>
      <section className="home-block">
        <p className="section-label">Featured thoughts</p>
        <ul className="entry-list">
          {featured.map((entry) => (
            <li key={entry.slug}>
              <Link className="entry-link" to={`/thoughts/${entry.slug}/`}>{entry.title}</Link>
              <p className="entry-meta">{formatDate(entry.date)} · {entry.kind}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
