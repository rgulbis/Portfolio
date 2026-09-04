import { SectionLabel } from './primitives.jsx';

function Strike({ children, tilt }) {
  return (
    <span
      className="inline-block font-mono text-[clamp(15px,2.8vw,22px)] font-normal text-strike-text line-through decoration-strike decoration-2"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}

function Fact({ label, children }) {
  return (
    <div>
      <dt className="font-mono text-[11px] tracking-[0.12em] text-label uppercase">{label}</dt>
      {children}
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      data-rise
      className="border-t border-rule px-0 pt-[clamp(56px,12vw,120px)] pb-[clamp(40px,8vw,80px)] sm:px-[2vw] lg:px-7"
    >
      <SectionLabel>01 — About</SectionLabel>
      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(24px,5vw,64px)]">
        <div>
          <h1 className="m-0 text-[clamp(32px,8vw,62px)] leading-[1.02] font-semibold tracking-[-0.035em]">
            <span className="flex flex-wrap items-baseline gap-3.5">
              <span>I follow</span>
              <Strike tilt={5}>the</Strike>
            </span>
            <span className="mt-1.5 flex flex-wrap items-baseline gap-3.5">
              <Strike tilt={-5}>rules</Strike>
              <span className="text-mustard">Creativity</span>
            </span>
          </h1>
          <p className="mt-[26px] max-w-[46ch] text-[clamp(16px,2vw,19px)] leading-[1.6] text-body">
            I am a student at Vidzeme Technology and Design Vocational School based in Cēsis,
            Latvia. What I enjoy most is the design side of it — finding creative solutions and
            making a thing look as good as I make it work.
          </p>
        </div>
        <div className="flex flex-col gap-[22px] border-l border-rule pl-[clamp(20px,3vw,34px)]">
          <dl className="m-0 flex flex-col gap-[18px]">
            <Fact label="Based">
              <dd className="mt-1 ml-0 text-[17px]">Cēsis, Latvia</dd>
            </Fact>
            <Fact label="Studying">
              <dd className="mt-1 ml-0 text-[17px]">Vocational secondary, EQF 4</dd>
              <dd className="mt-0.5 ml-0 text-sm text-muted">
                Vidzeme Technology and Design School, since 2023
              </dd>
            </Fact>
            <Fact label="Looking for">
              <dd className="mt-1 ml-0 text-[17px]">An internship in web development</dd>
            </Fact>
          </dl>
          <a
            href="/Roberts-Gulbis-CV.pdf"
            download
            className="inline-flex min-h-[44px] items-center justify-between gap-4 border border-ink px-[18px] py-3.5 font-mono text-xs tracking-[0.08em] uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            <span>Download CV</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
