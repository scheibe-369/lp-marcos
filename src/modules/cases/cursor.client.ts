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
 * Anti-glitch: a fileira AUTO-ROLA e os cards são tilteados sob perspective +
 * preserve-3d, então o hit-testing do browser fica impreciso — com os cards
 * deslizando sob o ponteiro, `e.target` às vezes resolve pra um CONTAINER
 * ancestral (track/3d/stage) em vez do card, mesmo com o ponteiro PARADO dentro
 * do card. Isso derrubava o selo pro cursor nativo no meio do card. Duas defesas:
 *   1) A auto-rolagem PAUSA no hover (CSS) → card parado = hit-testing estável.
 *   2) DESLIGAR tem debounce por TEMPO, e o prazo depende de ONDE o null veio:
 *      - null de FRESTA real = `e.target` é o próprio botão `[data-case-card]`
 *        (o padding entre frames pertence ao botão), sem `.case-frame`. Aí o
 *        ponteiro está MESMO num vão → desliga rápido (`OFF_FRESTA_MS`).
 *      - null de CONTAINER = `e.target` é track/3d/stage, SEM botão ancestral =
 *        glitch de hit-test sobre o card (ou o padding vazio do palco) → carência
 *        LONGA (`OFF_GLITCH_MS`): rajadas de glitch são curtas e intercaladas com
 *        acertos de frame (que cancelam o timer) → nunca derruba dentro do card;
 *        só o padding vazio sustentado acaba caindo pra nativo.
 * LIGAR é sempre imediato. O prazo ancora no PRIMEIRO null (não reinicia) e
 * qualquer acerto de frame cancela. Selo + título + cursor:none ligam/desligam
 * JUNTOS (setActive) → nunca "nativo + VER". Tempo (não contagem de amostras) é
 * invariante à velocidade do mouse e dispara mesmo com o mouse parado.
 * DESLIGADO em toque (pointer: coarse) e em prefers-reduced-motion.
 */
export function initCursor(): void {
  const stage = document.querySelector<HTMLElement>('[data-cases]');
  const cursor = document.querySelector<HTMLElement>('[data-cases-cursor]');
  if (!stage || !cursor) return;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (coarse || reduce) return;

  const OFF_FRESTA_MS = 80; // null sobre o BOTÃO (vão real) por mais que isso = fresta
  const OFF_GLITCH_MS = 220; // null sobre CONTAINER (glitch sobre o card / padding vazio)

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
  // na fresta ainda resolve pro cursor nativo dentro da janela. O prazo varia
  // conforme a origem do null (fresta real vs glitch de container).
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
    // Sem frame: distingue FRESTA real (target é o botão, padding entre frames)
    // de GLITCH de container (target é track/3d/stage, sem botão = hit-test 3D
    // errando sobre o card). Glitch ganha carência longa pra não derrubar o selo
    // dentro do card; um acerto de frame a tempo cancela qualquer um.
    const inButton = !!t?.closest<HTMLElement>('[data-case-card]');
    scheduleOff(inButton ? OFF_FRESTA_MS : OFF_GLITCH_MS);
  });

  stage.addEventListener('pointerleave', () => {
    cancelOff();
    setActive(null);
  });
}
