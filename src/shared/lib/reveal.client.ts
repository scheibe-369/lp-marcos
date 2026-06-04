/**
 * Reveal no scroll (PRD §10.5). Um único IntersectionObserver adiciona `.in`
 * aos elementos `.reveal` quando entram na viewport, e dá unobserve.
 * O stagger é controlado por cada componente via `--reveal-delay` inline.
 * Respeita prefers-reduced-motion: mostra tudo imediatamente, sem observar.
 */

export function initReveal(): void {
  if (typeof window === 'undefined') return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  els.forEach((el) => io.observe(el));
}
