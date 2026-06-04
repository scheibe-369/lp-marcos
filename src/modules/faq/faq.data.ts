export interface FaqItem {
  q: string;
  a: string;
}

export const faqTitle = {
  label: 'Dúvidas',
  title: 'Perguntas que sempre chegam.',
};

export const faq: FaqItem[] = [
  {
    q: 'Como funciona o processo do início ao fim?',
    a: 'Imersão no objetivo, roteiro e direção, captação, edição e finalização, e entrega nos formatos certos. Você acompanha em cada etapa.',
  },
  {
    q: 'Você atende presencial na Região dos Lagos ou também remoto?',
    a: 'Capto presencial na Região dos Lagos e regiões próximas, e faço edição e direção de conteúdo pra clientes do Brasil inteiro de forma remota.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Depende do formato e do volume. O prazo é alinhado no briefing, antes de começar, sem surpresa.',
  },
  {
    q: 'Em quais formatos você entrega?',
    a: 'Vertical pra redes, horizontal pra YouTube, cortes curtos e o master em alta resolução. O que cada canal precisar.',
  },
  {
    q: 'Como funciona o investimento?',
    a: 'Por projeto fechado ou em pacote mensal recorrente pra quem precisa de constância. O orçamento sai depois de entender o escopo.',
  },
  {
    q: 'Você cuida de roteiro e direção também?',
    a: 'Sim. Da ideia à finalização. Não sou só o cara que aperta o corte, penso a peça inteira.',
  },
];
