import { SectionLabel, ButtonLink } from './primitives.jsx';
import { projectBullets, projectTools, experience, awards } from '../content.js';

export default function Work() {
  return (
    <section
      id="work"
      data-rise
      className="border-t border-rule px-0 py-[clamp(48px,9vw,96px)] sm:px-[2vw] lg:px-7"
    >
      <SectionLabel>03 — Selected work</SectionLabel>

      <article className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(20px,4vw,56px)]">
        <div>
          <h2 className="m-0 text-[clamp(26px,5.6vw,40px)] leading-[1.08] font-semibold tracking-[-0.03em]">
            Entrepreneurs for Peace
          </h2>
          <p className="mt-2.5 font-mono text-xs tracking-[0.08em] text-label uppercase">
            Fundraiser site · with Draugiem Group
          </p>
          <p className="mt-5 max-w-[48ch] text-[clamp(15px,1.9vw,17px)] leading-[1.65] text-body">
            A live donation site for a charity campaign, handed to me as a Figma design, a Stripe
            account and an empty Wix project. I built it and my teacher oversaw the work.
          </p>
          <p className="mt-[26px] mb-2.5 font-mono text-[11px] tracking-[0.14em] text-label uppercase">
            What I did
          </p>
          <ul className="m-0 flex max-w-[48ch] list-none flex-col gap-2.5 p-0">
            {projectBullets.map((line) => (
              <li
                key={line}
                className="grid grid-cols-[14px_1fr] gap-3 text-[clamp(15px,1.9vw,17px)] leading-[1.55] text-bullet"
              >
                <span className="text-mustard">→</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-[26px] mb-2.5 font-mono text-[11px] tracking-[0.14em] text-label uppercase">
            I used
          </p>
          <ul className="m-0 flex max-w-[48ch] flex-wrap gap-2 p-0">
            {projectTools.map((tool) => (
              <li
                key={tool}
                className="list-none border border-rule px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-body uppercase"
              >
                {tool}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <ButtonLink href="https://www.uznemejimieram.lv/en" target="_blank" rel="noopener">
              Visit the site
            </ButtonLink>
            <ButtonLink
              href="https://www.facebook.com/VTDT.lv/posts/1306347777675907/"
              target="_blank"
              rel="noopener"
              variant="ghost"
            >
              Write-up
            </ButtonLink>
          </div>
        </div>
        <figure className="m-0">
          <img
            src="/project-efp.png"
            alt="Entrepreneurs for Peace homepage — “War takes. We give!” donation hero"
            className="block h-auto w-full border border-rule-strong"
          />
          <figcaption className="mt-2.5 font-mono text-[11px] tracking-[0.08em] text-muted">
            uznemejimieram.lv
          </figcaption>
        </figure>
      </article>

      <div className="mt-[clamp(40px,7vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-3.5">
        {experience.map((job) => (
          <div key={job.role} className="border border-rule bg-card px-[22px] py-[26px]">
            <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-mustard uppercase">
              {job.meta}
            </p>
            <h3 className="mt-3 mb-0 text-[21px] font-semibold tracking-[-0.02em]">{job.role}</h3>
            <p className="mt-1.5 mb-0 text-[13px] text-label">{job.kind}</p>
            <ul className="mt-4 mb-0 list-disc pl-[18px] text-[15px] leading-[1.6] text-body">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        {awards.map((award) => (
          <div key={award.title} className="border border-rule bg-card px-[22px] py-[26px]">
            <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-mustard uppercase">
              {award.date}
            </p>
            <h3 className="mt-3 mb-0 text-[21px] font-semibold tracking-[-0.02em]">
              {award.title}
            </h3>
            <p className="mt-1.5 mb-0 text-[13px] text-label">
              Honours and awards · {award.org}
            </p>
            <p className="mt-4 mb-0 text-[15px] leading-[1.6] text-body">{award.description}</p>
            <a
              href={award.href}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block text-[13px] text-muted underline hover:text-ink"
            >
              Link!
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
