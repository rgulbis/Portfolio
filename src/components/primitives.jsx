export function SectionLabel({ children }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.18em] text-mustard uppercase">
      {children}
    </span>
  );
}

export function ButtonLink({ href, children, variant = 'solid', ...rest }) {
  const base =
    'inline-flex min-h-[44px] items-center border px-[18px] py-[11px] font-mono text-xs tracking-[0.08em] uppercase transition-colors';
  const styles =
    variant === 'solid'
      ? 'border-ink hover:bg-ink hover:text-paper'
      : 'border-rule-strong text-muted hover:border-ink hover:text-ink';
  return (
    <a href={href} className={`${base} ${styles}`} {...rest}>
      {children}
    </a>
  );
}
