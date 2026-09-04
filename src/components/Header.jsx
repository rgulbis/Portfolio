const links = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Work', '#work'],
  ['Contact', '#contact'],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 -ml-[calc(50vw-50%)] flex w-screen flex-wrap items-baseline justify-between gap-x-6 gap-y-[10px] border-b border-rule bg-paper/90 px-5 pt-[18px] pb-4 backdrop-blur-md">
      <a
        href="#top"
        className="text-[clamp(17px,4.4vw,21px)] font-semibold tracking-[-0.02em]"
      >
        Roberts Gulbis
      </a>
      <nav className="flex flex-wrap gap-x-[18px] gap-y-1.5 font-mono text-xs tracking-[0.06em] uppercase">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
