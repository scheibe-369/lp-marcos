/**
 * Configuração cross-cutting do site — o ÚNICO dado global legítimo (modular-arch).
 * Contato, SEO e os helpers que montam links. Consumido por Base, hero, contact e footer.
 * Tudo aqui é placeholder do PRD §4; o Marcos troca depois.
 */

export interface Contact {
  whatsappNumber: string;
  whatsappMessage: string;
  calLink: string;
  instagram: string;
  youtube: string;
  region: string;
}

export const contact: Contact = {
  whatsappNumber: '5522992691113', // +55 22 99269-1113
  whatsappMessage: 'Oi Marcos, vim pela landing e quero falar sobre um projeto.',
  calLink: 'marcos-paulo-andrade-damascena-9kkqun/15min', // Cal.com event 6016497 — "Reunião de 15 min" (fallback se PUBLIC_CALCOM_LINK vazio)
  instagram: 'https://www.instagram.com/damascenafilms/',
  youtube: '', // PLACEHOLDER
  region: 'Região dos Lagos · RJ',
};

export const seo = {
  brand: 'Damascena Films',
  title: 'Damascena Films · Produção audiovisual estratégica · Região dos Lagos, RJ',
  description:
    'Produção audiovisual do filmmaker Marcos na Região dos Lagos, RJ, e remoto pro Brasil inteiro. Vídeo com estética de cinema e cabeça de estratégia: conteúdo, institucional, evento e edição que posiciona, prende atenção e converte.',
  url: 'https://damascenafilms.com.br',
  ogImage: '/og-image.jpg',
  lang: 'pt-BR',
} as const;

/** Monta o deep-link do WhatsApp com a mensagem pré-preenchida (codificada). */
export function buildWaLink(): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;
}

/** Resolve o slug do Cal.com: env público tem prioridade; cai no fallback de config. */
export function resolveCalLink(): string {
  return import.meta.env.PUBLIC_CALCOM_LINK || contact.calLink;
}
