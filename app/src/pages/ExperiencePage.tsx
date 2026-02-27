import { useSiteContent } from '../lib/hooks';

export function ExperiencePage() {
  const content = useSiteContent();
  const experiences = content?.home.experiences ?? [];

  return (
    <section className="home-block experience-block">
      <p className="section-label">{content?.home.experience_label ?? 'Experience'}</p>
      <ul className="experience-list">
        {experiences.map((job) => (
          <li key={`${job.company}-${job.period}`} className="experience-item">
            {job.logo && <img className="experience-logo" src={job.logo.src} alt={job.logo.alt} />}
            <div>
              <p className="experience-role">{job.role}</p>
              <p className="experience-company">{job.company} · {job.location}</p>
              <p className="experience-period">{job.period}</p>
              <p className="experience-summary">{job.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
