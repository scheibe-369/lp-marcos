/**
 * Lightbox de vídeo (PRD §10.4 / §9.6). O iframe (YouTube-nocookie/Vimeo) ou
 * <video> (mp4) é CRIADO só na abertura e DESTRUÍDO ao fechar (corta o som).
 * Foco preso no modal, fecha no X / Esc / clique no fundo, e devolve o foco
 * pro card de origem. Trava o scroll do body enquanto aberto.
 */
export function initLightbox(): void {
  const lb = document.querySelector<HTMLElement>('[data-lightbox]');
  const frame = lb?.querySelector<HTMLElement>('[data-lightbox-frame]');
  const closeBtn = lb?.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  if (!lb || !frame || !closeBtn) return;

  let lastFocused: HTMLElement | null = null;

  const buildEmbed = (type: string, id: string): HTMLElement => {
    if (type === 'mp4') {
      const v = document.createElement('video');
      v.src = id;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      return v;
    }
    const iframe = document.createElement('iframe');
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.setAttribute('title', 'Player de vídeo');
    iframe.src =
      type === 'vimeo'
        ? `https://player.vimeo.com/video/${id}?autoplay=1`
        : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    return iframe;
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    // Foco preso: alterna entre o botão fechar e a mídia
    const focusables = [
      closeBtn,
      ...Array.from(frame.querySelectorAll<HTMLElement>('iframe, video, button, [href], [tabindex]')),
    ];
    if (focusables.length <= 1) {
      e.preventDefault();
      closeBtn.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const open = (card: HTMLElement) => {
    lastFocused = card;
    frame.innerHTML = '';
    frame.appendChild(buildEmbed(card.dataset.videoType ?? 'youtube', card.dataset.videoId ?? ''));
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  };

  function close(): void {
    lb!.classList.remove('open');
    lb!.setAttribute('aria-hidden', 'true');
    frame!.innerHTML = ''; // destrói o iframe → para o áudio
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lastFocused?.focus();
    lastFocused = null;
  }

  document.querySelectorAll<HTMLElement>('[data-case-card]').forEach((card) => {
    card.addEventListener('click', () => open(card));
  });
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });
}
