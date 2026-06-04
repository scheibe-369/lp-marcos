import { buildWaLink, contact } from '../../shared/config/site';

export interface FooterLink {
  label: string;
  href: string;
}

export const footerNav: FooterLink[] = [
  { label: 'Trabalhos', href: '#cases' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Dúvidas', href: '#faq' },
  { label: 'Contato', href: '#contato' },
];

export const footerSocial: FooterLink[] = [
  { label: 'Instagram', href: contact.instagram },
  ...(contact.youtube ? [{ label: 'YouTube', href: contact.youtube }] : []),
  { label: 'WhatsApp', href: buildWaLink() },
];
