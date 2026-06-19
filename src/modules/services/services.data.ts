export interface Service {
  title: string;
  desc: string;
}

export const servicesTitle = {
  label: 'O que eu faço',
  title: 'Vídeo a serviço de **resultado**.',
};

export const services: Service[] = [
  {
    title: 'Conteúdo para redes',
    desc: 'Reels, TikTok e YouTube com ritmo, corte e retenção pensados pra prender nos primeiros segundos.',
  },
  {
    title: 'Vídeo institucional e branded',
    desc: 'A marca contada com estética de cinema e narrativa estratégica, não só apresentação.',
  },
  {
    title: 'Cobertura de evento',
    desc: 'Captação e aftermovie com entrega ágil do que realmente importou no dia.',
  },
  {
    title: 'Edição estratégica',
    desc: 'Roteiro, corte, som e cor trabalhando juntos pra fazer o vídeo performar.',
  },
];
