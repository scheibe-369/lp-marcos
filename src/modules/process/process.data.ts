export interface ProcessStep {
  n: string;
  title: string;
  desc: string;
}

export const processTitle = {
  label: 'Como eu trabalho',
  title: 'Começa **antes da câmera**.',
};

export const process: ProcessStep[] = [
  { n: '01', title: 'Imersão', desc: 'Entender o objetivo, o público e o que o vídeo precisa provocar.' },
  { n: '02', title: 'Roteiro e direção', desc: 'Definir narrativa, ritmo e referências antes de gravar.' },
  { n: '03', title: 'Captação', desc: 'Registrar com intenção, enquadramento e luz pensados, nada no automático.' },
  { n: '04', title: 'Edição e finalização', desc: 'Corte, trilha, som e cor a favor da retenção e da entrega de marca.' },
  { n: '05', title: 'Entrega', desc: 'Material pronto pra publicar, nos formatos que cada canal pede.' },
];
