import { Fragment } from 'react';
import { SectionLabel } from './primitives.jsx';
import { skillGroups } from '../content.js';

export default function Skills() {
  return (
    <section
      id="skills"
      data-rise
      className="border-t border-rule px-0 py-[clamp(48px,9vw,96px)] sm:px-[2vw] lg:px-7"
    >
      <SectionLabel>02 — Skills</SectionLabel>
      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
        {skillGroups.map((group) => (
          <div key={group.title} className="stack border border-rule bg-card px-[22px] py-6">
            <h3 className="mt-0 mb-[18px] font-mono text-[13px] font-medium tracking-[0.1em] uppercase">
              {group.title}
            </h3>
            <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-3">
              {group.items.map(([name, context]) => (
                <Fragment key={name}>
                  <dt className="text-[15px] font-semibold">{name}</dt>
                  <dd className="m-0 text-[13px] leading-[1.45] text-muted">
                    {Array.isArray(context)
                      ? context.map((part, i) =>
                          typeof part === 'string' ? (
                            <Fragment key={i}>{part}</Fragment>
                          ) : (
                            <a
                              key={i}
                              href={part.href}
                              target="_blank"
                              rel="noopener"
                              className="underline hover:text-ink"
                            >
                              {part.text}
                            </a>
                          )
                        )
                      : context}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
