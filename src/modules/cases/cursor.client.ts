/**
 * Cursor customizado "VER" (PRD §10.4). O ponteiro sobre o RETÂNGULO VISUAL de um
 * card (`.case-frame`) → o cursor nativo some, o selo dourado "VER" segue o
 * ponteiro e SÓ aquele card mostra o título. Na FRESTA entre os cards (e em
 * qualquer lugar fora de um frame) → cursor normal, sem selo e sem título.
 *
 * Por que keyar no `.case-frame` e não na área do botão: o frame é um quad
 * sólido — dentro dele `closest('.case-frame')` resolve sempre pro mesmo
 * elemento (img/overlay/tag são descendentes), então NÃO pisca enquanto você
 * mexe o mouse dentro do card. A fresta (padding do botão / vão) não é frame →
 * cursor nativo ali, exatamente como deve ser. Selo e título ligam/desligam
 * JUNTOS (setActive), então nunca aparece "nativo + VER" ao mesmo tempo.
 * Detecção por `pointermove` (responde ao SEU mouse, não aos cards rolando).
 *
 * Anti-glitch (SEM pausar a rolagem): a fileira AUTO-ROLA e os cards são
 * tilteados sob perspective + preserve-3d, então o hit-testing do browser fica
 * impreciso — com os cards deslizando sob o ponteiro, `e.target` às vezes
 * resolve pra um CONTAINER ancestral (track/3d/stage) em vez do card, derrubando
 * o selo pro cursor nativo no MEIO do card. A chave é, quando NÃO há `.case-frame`
 * sob o ponteiro, distinguir ONDE ele está:
 *   - FRESTA real: `e.target` é o próprio botão `[data-case-card]` (o padding
 *     entre frames pertence ao botão). Vão de verdade → desliga (debounce curto
 *     `OFF_FRESTA_MS`), cursor nativo ali — como deve ser.
 *   - CONTAINER puro: `e.target` é track/3d/stage, SEM botão ancestral = o
 *     hit-test 3D errou sobre o card (ou é o padding vazio do palco). Caso
 *     AMBÍGUO → NÃO desliga: mantém o estado atual (ON segue ON). É isso que mata
 *     o flicker dentro do card SEM precisar parar a rolagem (pausar no hover é
 *     horrível: o carrossel trava quando você passa o mouse).
 * Quem desliga o selo é só a FRESTA (botão) ou o pointerleave (sair do palco).
 * LIGAR é imediato; qualquer acerto de frame cancela um off pendente. Selo +
 * título + cursor:none ligam/desligam JUNTOS (setActive) → nunca "nativo + VER".
 * DESLIGADO em toque (pointer: coarse) e em prefers-reduced-motion.
 */
export function initCursor(): void {
  const stage = document.querySelector<HTMLElement>('[data-cases]');
  const cursor = document.querySelector<HTMLElement>('[data-cases-cursor]');
  if (!stage || !cursor) return;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduce) return;

  const OFF_FRESTA_MS = 80; // null sobre o BOTÃO (vão real) por mais que isso = fresta → nativo

  let x = 0;
  let y = 0;
  let raf = 0;
  let hovered: HTMLElement | null = null;
  let offTimer = 0;

  const render = () => {
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    raf = 0;
  };

  // Título/borda (no card) + selo VER + cursor:none ligam/desligam JUNTOS.
  const setActive = (card: HTMLElement | null) => {
    if (card !== hovered) {
      hovered?.classList.remove('is-hovered');
      card?.classList.add('is-hovered');
      hovered = card;
    }
    const on = !!card;
    stage.classList.toggle('has-hover', on);
    cursor.classList.toggle('on', on);
  };

  const cancelOff = () => {
    if (offTimer) {
      clearTimeout(offTimer);
      offTimer = 0;
    }
  };
  // Ancora o prazo no PRIMEIRO null (não reinicia a cada null) → o mouse parado
  // na fresta ainda resolve pro cursor nativo dentro da janela.
  const scheduleOff = (delay: number) => {
    if (offTimer) return;
    offTimer = window.setTimeout(() => {
      offTimer = 0;
      setActive(null);
    }, delay);
  };

  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);

    // Sobre o retângulo visual do card (`.case-frame`) → liga na hora.
    const t = e.target as HTMLElement | null;
    const frame = t?.closest<HTMLElement>('.case-frame') ?? null;
    if (frame) {
      cancelOff();
      setActive(frame.closest<HTMLElement>('[data-case-card]') ?? null);
      return;
    }
    // Sem frame mas DENTRO de um botão = fresta real (o padding entre frames
    // pertence ao botão) → desliga (cursor nativo no vão), com debounce curto.
    if (t?.closest<HTMLElement>('[data-case-card]')) {
      scheduleOff(OFF_FRESTA_MS);
      return;
    }
    // Sem frame e sem botão = target é um CONTAINER (track/3d/stage): o hit-test
    // 3D errou sobre o card enquanto a fileira ROLA (e.target caiu no ancestral
    // em vez do card). Caso AMBÍGUO → NÃO desliga: derrubaria o selo DENTRO do
    // card. Mantém o estado; quem desliga é a fresta (acima) ou o pointerleave.
  });

  stage.addEventListener('pointerleave', () => {
    cancelOff();
    setActive(null);
  });
}
