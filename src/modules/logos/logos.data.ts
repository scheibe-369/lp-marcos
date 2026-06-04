export interface Logo {
  name: string;
  src: string;
}

export const logosTitle = {
  label: 'Confiança',
  title: 'Quem já confiou no trabalho.',
};

/**
 * PLACEHOLDER — 8 clientes. Sem SVG real ainda: renderizados como chips de texto
 * monocromáticos (acendem no hover). Trocar por <img src={l.src}> quando houver
 * os logos em /images/logos/.
 */
export const logos: Logo[] = [
  { name: 'Cliente 1', src: '/images/logos/1.svg' },
  { name: 'Cliente 2', src: '/images/logos/2.svg' },
  { name: 'Cliente 3', src: '/images/logos/3.svg' },
  { name: 'Cliente 4', src: '/images/logos/4.svg' },
  { name: 'Cliente 5', src: '/images/logos/5.svg' },
  { name: 'Cliente 6', src: '/images/logos/6.svg' },
  { name: 'Cliente 7', src: '/images/logos/7.svg' },
  { name: 'Cliente 8', src: '/images/logos/8.svg' },
];
