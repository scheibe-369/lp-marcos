export interface Logo {
  name: string;
  src: string;
}

export const logosTitle = {
  label: 'Confiança',
  title: 'Quem já **confiou** no trabalho.',
};

/**
 * Clientes reais. Logos são imagens raster com fundos/formatos variados
 * (preto, branco, roxo; quadrado, wide, retrato), então o componente os
 * emoldura em tiles uniformes (card escuro + object-fit: contain) pra
 * normalizar tudo. `name` vira alt/title.
 */
export const logos: Logo[] = [
  { name: '+QI Like', src: '/images/logos/qi-like.jpg' },
  { name: 'Barbearia do Douglas', src: '/images/logos/barbearia-do-douglas.png' },
  { name: 'Corre y Treina', src: '/images/logos/corre-y-treina.jpg' },
  { name: 'Donos de Hamburguerias', src: '/images/logos/donos-de-hamburguerias.png' },
  { name: 'EDS', src: '/images/logos/eds-tight.png' },
  { name: 'Newtech 360', src: '/images/logos/newtech-tight.png' },
  { name: 'Poggi Fitness', src: '/images/logos/poggi-fitness.jpeg' },
  { name: 'Spartans Digital', src: '/images/logos/spartans-digital.jpg' },
];
