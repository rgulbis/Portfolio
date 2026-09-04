import { useState } from 'react';
import Cube from '../cube/Cube.jsx';

/** Line collapses into a ring, then the arrow fades in — staggered on hover/touch. */
function ScrollCue() {
  const [hot, setHot] = useState(false);
  const open = () => setHot(true);
  const close = () => setHot(false);

  return (
    <a
      href="#about"
      aria-label="Scroll to About"
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      onTouchStart={open}
      className="relative z-[1] flex min-h-[44px] flex-col items-center gap-3 px-5 py-2"
    >
      <span className="font-mono text-[11px] tracking-[0.18em] text-[oklch(0.52_0.012_80)] uppercase">
        scroll
      </span>
      <span className="relative grid h-[46px] w-[46px] place-items-center">
        <span
          className="absolute h-[46px] w-0.5 bg-gradient-to-b from-[oklch(0.75_0.02_85)] to-mustard"
          style={{
            opacity: hot ? 0 : 1,
            transition: `opacity .18s ease ${hot ? '0s' : '.24s'}`,
          }}
        />
        <span
          className="absolute box-border grid h-[46px] place-items-center border border-mustard bg-transparent"
          style={{
            width: hot ? 46 : 2,
            borderRadius: hot ? '50%' : 0,
            opacity: hot ? 1 : 0,
            transition: `width .28s cubic-bezier(.2,.7,.2,1), border-radius .3s ease ${
              hot ? '.26s' : '0s'
            }, opacity .12s ease ${hot ? '0s' : '.24s'}`,
          }}
        />
        <span
          className="pointer-events-none absolute text-[17px] leading-none text-mustard"
          style={{
            opacity: hot ? 1 : 0,
            transform: `translateY(${hot ? '0' : '-6px'})`,
            transition: `opacity .18s ease ${hot ? '.5s' : '0s'}, transform .18s ease ${
              hot ? '.5s' : '0s'
            }`,
          }}
        >
          ↓
        </span>
      </span>
    </a>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative -ml-[calc(50vw-50%)] flex min-h-[calc(100svh-62px)] w-screen flex-col items-center justify-end gap-1 px-5 pb-[18px]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 62% 52% at 50% 46%, oklch(0.99 0.012 85 / 0.75) 0%, transparent 70%)',
      }}
    >
      <div className="absolute top-0 right-0 bottom-[86px] left-0 z-0">
        <Cube className="h-full w-full" />
      </div>
      <ScrollCue />
    </section>
  );
}
