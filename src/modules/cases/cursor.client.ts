/**
 * Cursor customizado "VER" (PRD §10.4). Enquanto o ponteiro está sobre o
 * carrossel, o cursor nativo some e um selo dourado segue o ponteiro.
 * DESLIGADO em telas de toque (pointer: coarse) e em prefers-reduced-motion.
 */
export function initCursor(): void {
  const stage = document.querySelector<HTMLElement>('[data-cases]');
  const cursor = document.querySelector<HTMLElement>('[data-cases-cursor]');
  if (!stage || !cursor) return;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduce) return;

  let x = 0;
  let y = 0;
  let raf = 0;
  const render = () => {
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    raf = 0;
  };

  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  });
  stage.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    stage.classList.add('cursor-on');
    cursor.classList.add('on');
  });
  stage.addEventListener('pointerleave', () => {
    stage.classList.remove('cursor-on');
    cursor.classList.remove('on');
  });
}
