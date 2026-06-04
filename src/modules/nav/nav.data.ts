export interface NavItem {
  label: string;
  href: string;
}

/** Os href apontam pros id das sections no index.astro (§10.8). */
export const navItems: NavItem[] = [
  { label: 'Trabalhos', href: '#cases' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Dúvidas', href: '#faq' },
  { label: 'Contato', href: '#contato' },
];
