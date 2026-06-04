/**
 * Comportamento da nav (PRD §10.4): estado .scrolled após 30px e o drawer
 * mobile (abre/fecha, trava o scroll do body, foca o 1º link, fecha no Esc,
 * no clique no fundo e ao escolher um item; devolve o foco pro botão).
 */
export function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  // Estado .scrolled
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Drawer mobile
  const toggle = nav.querySelector<HTMLElement>('[data-nav-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-nav-drawer]');
  if (!toggle || !drawer) return;
  const closeBtn = drawer.querySelector<HTMLElement>('[data-nav-close]');
  const links = Array.from(drawer.querySelectorAll<HTMLAnchorElement>('a'));

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    links[0]?.focus();
  };
  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) close();
  });
  links.forEach((l) => l.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
}
