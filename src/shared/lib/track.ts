/**
 * Tracking leve (PRD §6.6). `track()` empurra um evento pro dataLayer (GTM/GA4)
 * e é NO-OP enquanto os IDs estão vazios (dataLayer indefinido).
 * `initClickTracking()` instala UM listener delegado: qualquer elemento com
 * [data-event] dispara o evento no clique — assim a maioria dos módulos não
 * embarca JS de tracking, só o atributo.
 */

interface DataLayerWindow {
  dataLayer?: Array<Record<string, unknown>>;
}

export function track(event: string): void {
  if (!event || typeof window === 'undefined') return;
  (window as DataLayerWindow).dataLayer?.push({ event });
}

export function initClickTracking(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    const el = target?.closest<HTMLElement>('[data-event]');
    if (el) track(el.dataset.event ?? '');
  });
}
