import { SectionLabel } from './primitives.jsx';
import { contact } from '../content.js';

export default function Contact() {
  return (
    <section
      id="contact"
      data-rise
      className="border-t border-rule px-0 pt-[clamp(48px,9vw,96px)] pb-[clamp(60px,10vw,110px)] sm:px-[2vw] lg:px-7"
    >
      <SectionLabel>04 — Contact</SectionLabel>
      <h2 className="mt-[26px] max-w-[22ch] text-[clamp(28px,6.6vw,52px)] leading-[1.06] font-semibold tracking-[-0.035em]">
        If you have something in mind, you know who to contact!
      </h2>
      <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
        {contact.map((row) => (
          <div key={row.label}>
            <p className="mt-0 mb-1.5 font-mono text-[11px] tracking-[0.1em] text-label uppercase">
              {row.label}
            </p>
            {row.href ? (
              <a href={row.href} className="text-[clamp(16px,2.2vw,20px)]">
                {row.value}
              </a>
            ) : (
              <p className="m-0 text-[clamp(16px,2.2vw,20px)]">{row.value}</p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-[clamp(44px,8vw,72px)] mb-0 font-mono text-[11px] tracking-[0.08em] text-faint">
        © 2026 Roberts Gulbis
      </p>
    </section>
  );
}
