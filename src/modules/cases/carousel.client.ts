/**
 * Carrossel diagonal (PRD §10.4). O track é movido por JS (translateX em espaço
 * rotacionado) — assim a inclinação não cria scroll horizontal na página e o
 * controle por wheel/drag/teclado é total. Inclinação -5deg desktop / -2deg
 * mobile / 0 em reduced-motion. Nas bordas, o wheel devolve o scroll pra página.
 */
export function initCarousel(): void {
  const stage = document.querySelector<HTMLElement>('[data-cases]');
  const track = document.querySelector<HTMLElement>('[data-cases-track]');
  if (!stage || !track) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pos = 0;

  const tilt = () => (reduce ? 0 : window.innerWidth <= 880 ? -2 : -5);
  const minPos = () => Math.min(0, stage.clientWidth - track.scrollWidth - 48);

  const apply = () => {
    pos = Math.max(minPos(), Math.min(0, pos));
    track.style.transform = `rotate(${tilt()}deg) translateX(${pos}px)`;
  };
  apply();

  // Wheel / trackpad → horizontal; libera nas bordas pra página rolar
  stage.addEventListener(
    'wheel',
    (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      const next = Math.max(minPos(), Math.min(0, pos - delta));
      if (next === pos) return; // borda → deixa a página rolar
      e.preventDefault();
      pos = next;
      apply();
    },
    { passive: false },
  );

  // Drag (pointer)
  let dragging = false;
  let startX = 0;
  let startPos = 0;
  let moved = false;

  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startPos = pos;
    stage.classList.add('dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    pos = startPos + dx;
    apply();
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('dragging');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', endDrag);

  // Um drag não deve abrir o lightbox (cancela o clique pós-arrasto)
  stage.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  // Teclado: setas movem quando o foco está dentro do track
  track.addEventListener('keydown', (e) => {
    const step = 360;
    if (e.key === 'ArrowRight') {
      pos -= step;
      apply();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      pos += step;
      apply();
      e.preventDefault();
    }
  });

  // Ao focar um card (Tab), traz ele pra vista
  track.addEventListener('focusin', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-case-card]');
    if (!card) return;
    const target = -(card.offsetLeft - stage.clientWidth / 2 + card.offsetWidth / 2);
    pos = target;
    apply();
  });

  window.addEventListener('resize', apply, { passive: true });
}
