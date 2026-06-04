# PRD — Landing Page Damascena Films

Documento de build para agente de código (Claude Code). Self-contained: leia este arquivo inteiro antes de escrever qualquer linha e monte o plano de execução a partir da seção "ORDEM DE IMPLEMENTAÇÃO".

---

## 1. CONTEXTO

Construir uma landing page única (one-pager) para a **Damascena Films**, marca de produção audiovisual do videomaker e editor **Marcos**, que atua na **Região dos Lagos, RJ**, e atende clientes do Brasil inteiro. O objetivo da página é gerar autoridade, passar profissionalismo de produtora de cinema e converter visitante em conversa (WhatsApp ou agendamento de call). A página vai rodar tráfego pago no futuro, então precisa carregar rápido e estar pronta pra receber pixel e GTM depois.

A direção estética é **refinada, cinematográfica, editorial**: azul marinho dominante, dourado champanhe raríssimo, tipografia serifada de display, grão sutil, e um carrossel de cases inclinado em diagonal. A referência de qualidade é site de cinematographer e produtora premium, não template de freelancer.

**Restrição inviolável:** a página NÃO pode parecer feita por IA nem template genérico. Isso significa: fidelidade absoluta ao sistema de cor e tipografia definido na seção 10, dourado em menos de 5% da tela, zero biblioteca de UI pronta, zero fonte genérica (nada de Inter, Roboto, system-ui), zero gradiente roxo, e atenção obsessiva a espaçamento, ritmo tipográfico e microinterações. Refinamento vem da execução precisa, não de excesso de efeito.

---

## 2. STACK TÉCNICA

Tudo abaixo é **não-negociável**. Se algo der problema, reporte em vez de trocar por conta própria.

| Componente | Tecnologia | Versão |
|---|---|---|
| Framework | Astro | 5.x |
| CSS | Tailwind CSS | 4.x (config CSS-first via `@tailwindcss/vite`) |
| Linguagem | TypeScript | 5.x |
| Fontes | @fontsource-variable/fraunces + @fontsource-variable/hanken-grotesk | latest |
| Imagens | `astro:assets` (`<Image />`) | nativo do Astro 5 |
| Agendamento | Cal.com embed inline (script oficial) | latest |
| Deploy | Cloudflare Pages (output estático, sem adapter) | — |

**Princípio de JS:** Astro entrega zero JS por padrão. Manter assim. Os únicos scripts client-side permitidos são os da seção 6 (carrossel/cursor/lightbox, marquee é CSS, FAQ é nativo, nav-scroll, reveal, embed do Cal.com). Nenhum framework de componente (sem React, Vue, Svelte). Tudo em componentes `.astro` com `<script>` em TypeScript vanilla.

---

## 3. ESTRUTURA DE ARQUIVOS

Crie esta árvore antes de codar qualquer coisa.

```
damascena-films/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── og-image.jpg                 # 1200x630, gerar depois (placeholder por enquanto)
│   └── images/
│       ├── cases/                   # stills em RETRATO dos cases (placeholder)
│       ├── logos/                   # logos de clientes (placeholder, monocromático)
│       └── marcos.jpg               # foto do Marcos (retrato) — placeholder
├── src/
│   ├── styles/
│   │   └── global.css               # @import tailwind + @theme + base + grão + utilitários + reveal
│   ├── data/
│   │   └── site.ts                  # TODO o conteúdo e a copy (seção 4)
│   ├── layouts/
│   │   └── Base.astro               # <head>, SEO, OG, JSON-LD, fontes, placeholders de tracking
│   ├── components/
│   │   ├── Nav.astro                # nav fixa + menu mobile
│   │   ├── Hero.astro               # eyebrow, h1, role, lede, CTA, moldura de imagem em retrato
│   │   ├── Cases.astro              # carrossel DIAGONAL + cursor "VER" + lightbox
│   │   ├── Services.astro           # "o que ele faz" (cards de serviço)
│   │   ├── Process.astro            # "como ele faz" (passos do método)
│   │   ├── About.astro              # "quem é o Marcos" + stats
│   │   ├── Logos.astro              # marquee infinito de logos
│   │   ├── Faq.astro                # accordion com <details>
│   │   ├── Contact.astro            # CTA WhatsApp + embed Cal.com
│   │   └── Footer.astro
│   └── pages/
│       └── index.astro              # importa Base + todas as seções na ordem da seção 10.8
└── .env                             # apenas IDs de tracking (PUBLIC_*), vazios por enquanto
```

`Services.astro` e `Process.astro` são renderizados dentro de **uma mesma `<section>`** no `index.astro` (a seção "o que faz e como faz"), com o bloco de serviços em cima e o método embaixo.

---

## 4. CONTEÚDO E MODELO DE DADOS (sem banco)

Não existe banco de dados, backend nem formulário com submit. Todo o conteúdo vive em `src/data/site.ts`. A copy abaixo é **placeholder original em português** (escrita do zero, não copiar de site nenhum). Marcos troca depois.

```ts
// src/data/site.ts

export interface CaseItem {
  slug: string;
  client: string;          // etiqueta de cima (nome do cliente/empresa)
  project: string;         // nome do projeto, aparece em Fraunces no hover
  tag: string;             // "Publicidade" | "Conteúdo" | "Vendas" | "Evento" ...
  thumb: string;           // /images/cases/xxx.jpg  (RETRATO, ~3:4)
  videoType: 'youtube' | 'vimeo' | 'mp4';
  videoId: string;         // id do youtube/vimeo OU caminho do mp4
}

export interface Service { title: string; desc: string; }
export interface ProcessStep { n: string; title: string; desc: string; }
export interface FaqItem { q: string; a: string; }
export interface Logo { name: string; src: string; }

export const contact = {
  whatsappNumber: '5522999999999',                 // PLACEHOLDER — trocar
  whatsappMessage: 'Oi Marcos, vim pela landing e quero falar sobre um projeto.',
  calLink: 'marcos/call',                           // PLACEHOLDER — link do Cal.com
  instagram: 'https://www.instagram.com/_marcospad/',
  youtube: '',                                      // PLACEHOLDER
  region: 'Região dos Lagos · RJ',
};

export const hero = {
  eyebrow: 'Produção audiovisual · Região dos Lagos, RJ',
  brand: 'Damascena',                               // o ".Films" é montado no componente
  role: 'Filmmaker · Edição estratégica',
  lede: 'Imagem com intenção. Da captação à edição, transformo conteúdo em **posicionamento, autoridade e venda** — não em vídeo bonito que não leva a lugar nenhum.',
  cta: 'Vamos conversar',
};

export const cases: CaseItem[] = [
  { slug: 'campanha-verao', client: 'Marca de moda',   project: 'Campanha Verão',     tag: 'Publicidade', thumb: '/images/cases/01.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
  { slug: 'bastidores',     client: 'Restaurante',      project: 'Série Bastidores',   tag: 'Conteúdo',    thumb: '/images/cases/02.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
  { slug: 'vsl-lancamento', client: 'Infoprodutor',     project: 'VSL de Lançamento',  tag: 'Vendas',      thumb: '/images/cases/03.jpg', videoType: 'vimeo',   videoId: 'PLACEHOLDER' },
  { slug: 'aftermovie',     client: 'Produtora de evento', project: 'Aftermovie',      tag: 'Evento',      thumb: '/images/cases/04.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
  { slug: 'reels-serie',    client: 'Criador',          project: 'Série de Reels',     tag: 'Conteúdo',    thumb: '/images/cases/05.jpg', videoType: 'youtube', videoId: 'PLACEHOLDER' },
];

export const servicesTitle = { label: 'O que eu faço', title: 'Vídeo a serviço de resultado.' };
export const services: Service[] = [
  { title: 'Conteúdo para redes',        desc: 'Reels, TikTok e YouTube com ritmo, corte e retenção pensados pra prender nos primeiros segundos.' },
  { title: 'Vídeo institucional e branded', desc: 'A marca contada com estética de cinema e narrativa estratégica, não só apresentação.' },
  { title: 'Cobertura de evento',        desc: 'Captação e aftermovie com entrega ágil do que realmente importou no dia.' },
  { title: 'Edição estratégica',         desc: 'Roteiro, corte, som e cor trabalhando juntos pra fazer o vídeo performar.' },
];

export const processTitle = { label: 'Como eu trabalho', title: 'Começa antes da câmera.' };
export const process: ProcessStep[] = [
  { n: '01', title: 'Imersão',             desc: 'Entender o objetivo, o público e o que o vídeo precisa provocar.' },
  { n: '02', title: 'Roteiro e direção',   desc: 'Definir narrativa, ritmo e referências antes de gravar.' },
  { n: '03', title: 'Captação',            desc: 'Registrar com intenção, enquadramento e luz pensados, nada no automático.' },
  { n: '04', title: 'Edição e finalização', desc: 'Corte, trilha, som e cor a favor da retenção e da entrega de marca.' },
  { n: '05', title: 'Entrega',             desc: 'Material pronto pra publicar, nos formatos que cada canal pede.' },
];

export const aboutTitle = { label: 'Quem é o Marcos' };
export const aboutStats = [
  { big: '+X', label: 'projetos entregues' },        // PLACEHOLDER — trocar números
  { big: '+X', label: 'nichos atendidos' },
];
export const about = [
  'Sou Marcos, filmmaker por trás da **Damascena Films**. Atuo na Região dos Lagos e atendo marcas e criadores do Brasil inteiro.',
  'Não faço vídeo pra preencher feed. Faço pra **posicionar, prender atenção e converter** — com a régua de cinema e a cabeça de quem entende crescimento.',
  'Cada projeto começa num objetivo e termina numa peça que **trabalha pelo cliente**, não num arquivo bonito que ninguém assiste até o fim.',
];

export const logosTitle = { label: 'Confiança', title: 'Quem já confiou no trabalho.' };
export const logos: Logo[] = [
  // PLACEHOLDER — 8 a 12 logos monocromáticos em /images/logos/
  { name: 'Cliente 1', src: '/images/logos/1.svg' },
  { name: 'Cliente 2', src: '/images/logos/2.svg' },
  { name: 'Cliente 3', src: '/images/logos/3.svg' },
  { name: 'Cliente 4', src: '/images/logos/4.svg' },
  { name: 'Cliente 5', src: '/images/logos/5.svg' },
  { name: 'Cliente 6', src: '/images/logos/6.svg' },
  { name: 'Cliente 7', src: '/images/logos/7.svg' },
  { name: 'Cliente 8', src: '/images/logos/8.svg' },
];

export const faqTitle = { label: 'Dúvidas', title: 'Perguntas que sempre chegam.' };
export const faq: FaqItem[] = [
  { q: 'Como funciona o processo do início ao fim?', a: 'Imersão no objetivo, roteiro e direção, captação, edição e finalização, e entrega nos formatos certos. Você acompanha em cada etapa.' },
  { q: 'Você atende presencial na Região dos Lagos ou também remoto?', a: 'Capto presencial na Região dos Lagos e regiões próximas, e faço edição e direção de conteúdo pra clientes do Brasil inteiro de forma remota.' },
  { q: 'Qual o prazo de entrega?', a: 'Depende do formato e do volume. O prazo é alinhado no briefing, antes de começar, sem surpresa.' },
  { q: 'Em quais formatos você entrega?', a: 'Vertical pra redes, horizontal pra YouTube, cortes curtos e o master em alta resolução. O que cada canal precisar.' },
  { q: 'Como funciona o investimento?', a: 'Por projeto fechado ou em pacote mensal recorrente pra quem precisa de constância. O orçamento sai depois de entender o escopo.' },
  { q: 'Você cuida de roteiro e direção também?', a: 'Sim. Da ideia à finalização. Não sou só o cara que aperta o corte, penso a peça inteira.' },
];

export const contactSection = {
  title: 'Bora tirar o seu próximo vídeo do papel?',
  text: 'Me conta o que você precisa. A gente alinha objetivo, formato e prazo numa conversa rápida, sem compromisso.',
  whatsappLabel: 'Falar no WhatsApp',
  calLabel: 'Ou marque uma call:',
};
```

Trechos com `**texto**` na copy devem ser renderizados com a cor `--accent-soft` e peso maior (negrito de destaque), exatamente como no protótipo. Não renderizar markdown literal: o componente quebra a string e aplica a classe nos trechos entre `**`.

---

## 5. FILAS / JOBS

Não aplicável. Site estático sem processamento assíncrono.

---

## 6. REGRAS DE IMPLEMENTAÇÃO

1. **Zero JS desnecessário.** Astro é estático por padrão. Use `<script>` em componente `.astro` só onde a seção 10 exige interação. Marquee e FAQ não usam JS (CSS e `<details>` nativos).

2. **Imagens sempre via `astro:assets`.** Todo still de case, logo e foto usa `<Image />` com `width`/`height` explícitos (zero layout shift), formato AVIF/WebP, `loading="lazy"` em tudo menos a imagem do hero, que recebe `loading="eager"` e `fetchpriority="high"`.

3. **Fontes self-hosted.** Importar `@fontsource-variable/fraunces` e `@fontsource-variable/hanken-grotesk` no `Base.astro`. `font-display: swap`. Nada de `<link>` pro Google Fonts (evita request externo e bloqueio de render).

4. **Acessibilidade obrigatória.** Todo `<img>` com `alt` descritivo (ex: `alt="Still do projeto Campanha Verão para Marca de moda"`). Estados `:focus-visible` visíveis (anel dourado fino) em todos os elementos interativos. Carrossel navegável por teclado (cards focáveis, setas esquerda/direita movem o scroll). Lightbox com foco preso (focus trap), fecha no Esc, devolve o foco pro card de origem. Contraste: dourado só em texto grande ou detalhe, nunca em corpo de texto.

5. **`prefers-reduced-motion`.** Quando ativo: desligar a inclinação animada e o auto-scroll do carrossel (manter scroll manual), parar o marquee (vira fileira estática), e mostrar todos os elementos `.reveal` imediatamente (sem fade/translate). A funcionalidade continua, só a animação some.

6. **Ganchos de tracking, sem tracking ainda.** Em `Base.astro`, deixar blocos comentados pra Meta Pixel, GTM e GA4 lendo `import.meta.env.PUBLIC_*`. Em todo CTA (WhatsApp, agendar, cards de case), adicionar `data-event="nome_do_evento"` (ex: `whatsapp_click`, `cal_open`, `case_open`). Criar um helper `track(event: string)` que faz `window.dataLayer?.push(...)` e é no-op enquanto os IDs estiverem vazios. Não instalar pixel agora.

7. **Responsivo mobile-first.** Breakpoint principal em **880px** (igual ao protótipo). Abaixo dele: menu vira botão "Menu" (drawer ou overlay simples), seções com padding vertical 78px, grids viram uma coluna. Tratamento específico do hero e do carrossel no mobile na seção 10.

8. **Links externos** sempre com `target="_blank"` e `rel="noopener noreferrer"`.

9. **Sem `localStorage`/`sessionStorage`.** Não há estado persistente.

10. **Performance alvo:** Lighthouse mobile 95+ em Performance e 100 em Acessibilidade/SEO. LCP do hero rápido (imagem otimizada e priorizada, fonte preload).

---

## 7. VARIÁVEIS DE AMBIENTE

Conteúdo e contato ficam em `src/data/site.ts`. O `.env` guarda só os IDs de tracking, que entram depois. Prefixo `PUBLIC_` porque o Astro só expõe ao client variáveis com esse prefixo.

```env
# Tracking — deixar vazio por enquanto, adicionar quando for rodar tráfego
PUBLIC_META_PIXEL_ID=
PUBLIC_GTM_ID=
PUBLIC_GA4_ID=
```

Garantir `.env` no `.gitignore` antes de qualquer commit.

---

## 8. ORDEM DE IMPLEMENTAÇÃO

Cada passo depende só dos anteriores. Rode o teste de cada passo antes de seguir.

**Passo 1 — Setup.** `npm create astro@latest` (template vazio, TypeScript strict). Adicionar Tailwind 4 via `@tailwindcss/vite` no `astro.config.mjs`. Instalar as duas fontes do fontsource.
**Test:** `npm run dev` sobe sem erro e uma página vazia renderiza.

**Passo 2 — Tokens e base.** Criar `src/styles/global.css` com `@import "tailwindcss"`, o bloco `@theme` (seção 10.1), os estilos base do `body`, o overlay de grão, a classe `.reveal` e o container `.wrap`. Importar fontes e `global.css` no `Base.astro`.
**Test:** o fundo fica `#0a1326`, o texto usa Hanken, e um `<h1>` de teste em Fraunces renderiza com a cor `--ink`. O grão aparece sutil por cima.

**Passo 3 — Layout e Nav.** `Base.astro` com `<head>` completo (seção 10 + SEO da seção 10.9 ainda básico). `Nav.astro` fixa, com blur, marca "Damascena.Films" (ponto dourado), menu, e o estado `.scrolled` via script.
**Test:** ao rolar 30px a nav ganha borda inferior e fundo mais opaco. No mobile o menu vira botão.

**Passo 4 — Hero.** `Hero.astro` com eyebrow, h1, role, lede (com destaques em `--accent-soft`), CTA pill, e a moldura de imagem em retrato à direita com o `<Image>` do Marcos. Halo dourado de fundo.
**Test:** hero ocupa 100vh, o CTA preenche de dourado no hover com a seta deslizando, e no mobile a moldura some e o conteúdo respira.

**Passo 5 — Cases (a peça principal).** `Cases.astro`: carrossel horizontal de cards em retrato, track inclinado em diagonal, cursor customizado "VER", overlay de nome no hover, e lightbox de vídeo. Comportamento exato na seção 10.4.
**Test:** o track aparece inclinado; passar o mouse num card mostra o cursor "VER" e o nome do projeto; clicar abre o player no lightbox; Esc e clique no fundo fecham; teclado navega. No mobile a inclinação suaviza e nome + tag ficam visíveis sem hover.

**Passo 6 — O que faz e como faz.** Uma `<section>` no index com `Services.astro` (cards de serviço) em cima e `Process.astro` (passos numerados com o número grande em dourado) embaixo.
**Test:** os cards reagem no hover (borda acende), os números do método aparecem grandes em Fraunces dourado, tudo entra com reveal no scroll.

**Passo 7 — Quem é o Marcos.** `About.astro`: grid com stats (números grandes dourados) de um lado e parágrafos em Fraunces leve do outro, com destaques em `--accent-soft`.
**Test:** layout em duas colunas no desktop, uma no mobile, com os stats acima dos textos no mobile.

**Passo 8 — Logos (marquee).** `Logos.astro`: fileira infinita em loop, set duplicado pra loop contínuo, logos em cinza/baixa opacidade que acendem no hover, pausa no hover.
**Test:** os logos correm suave e infinito sem corte visível; com `prefers-reduced-motion` viram fileira estática.

**Passo 9 — FAQ.** `Faq.astro` com `<details>`/`<summary>` estilizados, marcador (+/−) dourado, divisórias em `--line`, transição suave.
**Test:** abre/fecha no clique e no teclado, só visual de uma aberta por vez é opcional (pode deixar múltiplas).

**Passo 10 — Contato.** `Contact.astro`: título, texto, botão de WhatsApp (CTA primário, monta o link `wa.me` com a mensagem) e logo abaixo o embed inline do Cal.com com tema escuro e brand color dourado. Halo dourado de fundo.
**Test:** o botão abre o WhatsApp com a mensagem preenchida; o calendário do Cal.com renderiza inline no tema escuro.

**Passo 11 — Footer.** `Footer.astro`: marca, linha "Produção audiovisual · Região dos Lagos · RJ", navegação, social (Instagram, YouTube, WhatsApp), copyright 2026.
**Test:** três colunas no desktop, uma no mobile, links de social abrindo em nova aba.

**Passo 12 — SEO, OG e JSON-LD.** Completar o `<head>` (seção 10.9): title, description, canonical, OG/Twitter, favicon, e o JSON-LD de ProfessionalService.
**Test:** validar OG no preview e o JSON-LD no Rich Results Test do Google sem erro.

**Passo 13 — Tracking placeholders.** Inserir os blocos comentados de pixel/GTM/GA4 e o helper `track()` com os `data-event` nos CTAs.
**Test:** com IDs vazios, nada dispara e nada quebra no console.

**Passo 14 — Performance e QA.** Rodar `astro build`, checar Lighthouse mobile, revisar `prefers-reduced-motion`, foco por teclado e responsivo em 360px, 768px, 1180px, 1440px.
**Test:** Lighthouse 95+ Performance, 100 Acessibilidade e SEO; nenhum layout shift; carrossel e lightbox ok no teclado.

---

## 9. ANTI-PADRÕES (NÃO FAZER)

1. NÃO trocar Astro por Next, Vite puro ou qualquer outro framework.
2. NÃO adicionar React/Vue/Svelte nem biblioteca de componentes (shadcn, MUI, etc.). Tudo `.astro` + CSS + script vanilla.
3. NÃO usar fontes genéricas (Inter, Roboto, Arial, system-ui). Só Fraunces (display) e Hanken Grotesk (corpo).
4. NÃO deixar o dourado dominar. Dourado em menos de 5% da tela, só em detalhe (ponto da marca, eyebrows, borda do CTA, números, sublinhado, contorno do play, marcador do FAQ). Navy domina ~90%.
5. NÃO transformar os cases em grid estático nem em lista. É carrossel horizontal inclinado com hover e lightbox.
6. NÃO usar `<iframe>` de vídeo carregando na página toda de cara. O iframe do YouTube/Vimeo só é injetado quando o lightbox abre, e removido quando fecha.
7. NÃO dar autoplay com som em nada.
8. NÃO criar backend, API, nem formulário de contato com submit. Conversão é WhatsApp + Cal.com, só.
9. NÃO usar gradiente roxo, sombra neon, glassmorphism exagerado nem qualquer clichê de "AI slop".
10. NÃO escrever copy nova "criativa" por conta própria fora do que está em `site.ts`. Use a copy do arquivo; ela é placeholder e será trocada.
11. NÃO usar `localStorage`/`sessionStorage`.
12. NÃO quebrar o layout no mobile por causa da inclinação do carrossel. Diminua a rotação e mantenha tudo dentro da viewport.
13. NÃO inventar números nos stats nem nomes reais de cliente. Mantenha os placeholders.

---

## 10. IDENTIDADE VISUAL E DESIGN SYSTEM

Modo: **dark only.** Esta é a fonte da verdade visual, portada do protótipo aprovado. Mantenha os valores exatos.

### 10.1 Paleta de cor

`@theme` do Tailwind 4 em `global.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg:          #0a1326; /* azul marinho profundo — fundo de tudo */
  --color-bg-soft:     #0f1c38; /* navy um tom acima — cards, hover de logo */
  --color-ink:         #eef2f8; /* branco frio — texto e títulos */
  --color-ink-soft:    #8a98b3; /* azul-cinza suave — texto secundário */
  --color-line:        #1c2c4d; /* navy de borda — linhas e divisórias */
  --color-accent:      #c9a96a; /* dourado champanhe — detalhe premium */
  --color-accent-soft: #e2c896; /* dourado claro — destaques no texto */

  --font-display: "Fraunces Variable", "Fraunces", serif;
  --font-body:    "Hanken Grotesk Variable", "Hanken Grotesk", sans-serif;
}
```

Tons auxiliares (fixos no CSS, não são tokens):

```
Gradiente da moldura do hero:      linear-gradient(145deg, #16294a, #0b1730)
Gradiente da mídia dos cases:      linear-gradient(135deg, #14274a, #0a1426)
Borda do card no hover:            #33486e
Texto placeholder "Sua imagem":    #3a4d72
```

Brilhos e transparências (mesmas cores, com opacidade):

```
Fundo da nav (topo):               rgba(10,19,38,.55)
Fundo da nav (rolado):             rgba(10,19,38,.88)
Halo dourado do hero:              rgba(201,169,106,.12)
Halo dourado do contato:           rgba(201,169,106,.10)
```

**Regra de proporção (o que dá o ar premium):** navy ~90% da tela, branco/azul-cinza carregam o texto, dourado em menos de 5%, só em detalhe. O dourado funciona porque é raro. Não espalhar.

Grão global (overlay fixo, `opacity: .035`, `pointer-events:none`, `z-index:1`):

```css
body::before{
  content:"";position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### 10.2 Tipografia

`font-weight` base do corpo: 300. `line-height` base: 1.6. `-webkit-font-smoothing: antialiased`.

| Nível | Família | Tamanho | Peso | Line-height | Uso |
|---|---|---|---|---|---|
| H1 (hero) | Fraunces | `clamp(48px, 8vw, 104px)` | 400 | .95 | nome da marca no hero; `em` em itálico cor `--accent-soft` |
| H2 (título de seção) | Fraunces | `clamp(32px, 5vw, 54px)` | 400 | 1.05 | títulos das seções; letter-spacing -.02em |
| H3 (card/case) | Fraunces | 30px | 400 | 1.1 | nome do projeto/serviço |
| Stat (número grande) | Fraunces | 64px | 400 | 1 | números do "sobre" e do método, cor `--accent` |
| Lede | Hanken | `clamp(17px, 2.2vw, 21px)` | 300 | 1.6 | parágrafo de apoio do hero; `b` em 600 cor `--accent-soft` |
| Sobre (parágrafo) | Fraunces | `clamp(18px, 2.4vw, 24px)` | 300 | 1.5 | textos do "quem é o Marcos" |
| Body | Hanken | 15px | 300–400 | 1.6 | descrições, FAQ |
| Menu | Hanken | 14px | 400 | — | nav; letter-spacing .03em |
| Eyebrow / sec-label | Hanken | 13px | 400 | — | uppercase, letter-spacing .22em, cor `--accent` |
| Role | Hanken | 15px | 400 | — | uppercase, letter-spacing .16em, cor `--ink-soft` |
| Tag / label pequeno | Hanken | 11px | 400 | — | uppercase, letter-spacing .18em |

H1 do hero: o ".Films" tem o ponto em `--accent` e "Films" em itálico `--accent-soft`. Letter-spacing do H1: -.02em.

### 10.3 Espaçamento e grid

```
MAX_WIDTH (container .wrap):   1180px
PADDING lateral do container:  28px
PADDING vertical de seção:     110px (desktop) / 78px (mobile <880px)
ALTURA da nav:                 74px
BORDER_RADIUS:                 4px (moldura/botão pill usa 40px) / 6px (cards e grids)
GAP base entre cards:          26px
```

Divisórias entre seções: `border-top: 1px solid var(--color-line)` nas seções "sobre", "clientes" e "contato" (igual ao protótipo).

### 10.4 Componentes interativos (especificação detalhada)

**Nav (`Nav.astro`)**
Fixa no topo, `backdrop-filter: blur(10px)`, fundo `rgba(10,19,38,.55)`, borda inferior transparente. Marca em Fraunces 21px/500 com ponto dourado. Menu: gap 34px, itens 14px cor `--ink-soft` → `--ink` no hover, com sublinhado dourado de 1px que cresce da esquerda (`width 0 → 100%`, transição .3s). Script: ao `scrollY > 30`, adiciona classe `.scrolled` que troca fundo pra `rgba(10,19,38,.88)` e acende a borda em `--line`. Mobile <880px: menu some, aparece botão "Menu".

**CTA / botão primário**
Pill: `padding: 15px 30px`, `border: 1px solid var(--color-accent)`, `border-radius: 40px`, texto 14px letter-spacing .05em cor `--ink`, fundo transparente. Hover: fundo `--accent`, texto `#0a1326` (navy), e a seta SVG desliza 4px pra direita. Transição .3s.

**Cases — carrossel diagonal com cursor "VER" e lightbox (`Cases.astro`) — peça principal**

Estrutura: faixa horizontal de cards em **retrato** (aspect ~3:4), com scroll horizontal (drag + trackpad/wheel + setas de teclado). O contêiner da faixa é rotacionado em diagonal cinematográfica.

- **Inclinação:** o wrapper do scroller recebe `transform: rotate(-5deg)` no desktop, com padding vertical generoso (ex: 80px em cima e embaixo) e `overflow: visible` no eixo cross pra rotação não cortar os cantos. Os cards ficam alinhados ao eixo do track (acompanham a rotação). Sensação igual à do site do Alex Le. No mobile (<880px): rotação cai pra `-2deg` ou `0`, cards menores, e o scroll continua horizontal.
- **Card:** still em retrato cobrindo o card (`object-fit: cover`), cantos `border-radius: 4px`, borda `1px solid var(--color-line)`. Etiqueta da tag no topo-esquerdo (11px uppercase ls .18em cor `--ink-soft`). 
- **Hover (desktop):** o card escurece levemente com um gradiente de baixo pra cima; aparece o **nome do cliente** (label pequeno, ex "VIEW"/"VER" style) e o **nome do projeto** em Fraunces sobre a thumb, centralizado ou no rodapé do card (referência: o "CONSUELA" do print). Card sobe sutil (`translateY(-4px)`) e a borda acende pra `#33486e`.
- **Cursor customizado "VER":** enquanto o mouse está sobre a área do carrossel, o cursor nativo some (`cursor: none`) e um selo circular segue o ponteiro: `~72px`, fundo `--accent`, texto "VER" em Hanken 12px uppercase letter-spacing .15em cor navy `#0a1326`, centralizado. `position: fixed; pointer-events: none; z-index alto`. Aparece com leve `scale`/fade ao entrar num card. Fora do carrossel, cursor normal.
- **Clique:** abre o **lightbox**. Overlay `rgba(10,19,38,.92)` com `backdrop-filter: blur(8px)`, player 16:9 centralizado `max-width: 1000px`, botão de fechar (X) no topo-direito com contorno dourado fino. O iframe (YouTube/Vimeo por `videoId`, ou `<video>` pro mp4) só é criado na abertura, com autoplay, e **destruído ao fechar** (pra parar o som). Fecha no X, no Esc e no clique no fundo. `body` com scroll travado enquanto aberto. Foco preso no modal; ao fechar, devolve foco ao card. `data-event="case_open"`.
- **Mobile:** sem cursor customizado e sem hover. Cada card mostra o nome do cliente + nome do projeto + tag **sempre visíveis** num rodapé com gradiente. Toque abre o lightbox.
- **Teclado:** cards são `<button>` ou `<a>` focáveis; setas esquerda/direita rolam o track; Enter/Espaço abrem o lightbox.

**Serviços (`Services.astro`)**
Cards em grid (ex: 2 colunas no desktop, 1 no mobile), fundo `--bg-soft`, borda `--line`, radius 6px, `padding ~32px`. Título do card em Fraunces, descrição em Hanken cor `--ink-soft`. Hover: borda acende pra `#33486e` e sobe `translateY(-4px)`, transição .4s.

**Método (`Process.astro`)**
Lista de passos. Cada passo com o **número grande** (`01`–`05`) em Fraunces 64px cor `--accent`, título em Fraunces/Hanken e descrição em `--ink-soft`. Layout em linha vertical com divisórias `--line` entre passos, ou grid de passos; manter respiro generoso.

**Sobre (`About.astro`)**
Grid `1fr 1.3fr`, gap 70px, `align-items: start`. Coluna esquerda: stats, cada um com número grande Fraunces 64px `--accent` em cima e label `--ink-soft` embaixo, `margin` entre stats ~34px. Coluna direita: parágrafos em Fraunces 300 `clamp(18px,2.4vw,24px)` lh 1.5, com destaques em `--accent-soft` peso 500, espaçados ~26px entre si. Mobile: uma coluna, stats acima.

**Logos — marquee (`Logos.astro`)**
Faixa horizontal infinita. Renderizar o array de logos **duplicado** (dois sets idênticos em sequência) dentro de um track flex; animar `transform: translateX(0 → -50%)` em loop linear infinito (~35s). `animation-play-state: paused` no hover. Logos com altura fixa (~30px), `filter: grayscale(1)` e `opacity: .5`, indo pra `opacity: 1` e cor cheia no hover. Bordas/gradiente de fade nas laterais opcional. `prefers-reduced-motion`: animação `none`, vira fileira estática centralizada (ou grade de 4 colunas como fallback). Sem corte visível no loop (por isso o set duplicado e o -50%).

**FAQ — accordion (`Faq.astro`)**
Usar `<details>`/`<summary>` nativos (acessível, zero JS). `summary` com a pergunta em Hanken 500 ~18px cor `--ink`, e um marcador `+` que vira `−` (ou chevron que rotaciona) em `--accent` à direita. Esconder o marcador nativo (`summary::-webkit-details-marker{display:none}`). Divisória `border-bottom: 1px solid var(--color-line)` entre itens, `padding` vertical ~22px. Resposta em `--ink-soft`, com transição suave de abertura (animar via `grid-template-rows: 0fr → 1fr` no conteúdo, ou `max-height`). Pode deixar várias abertas ao mesmo tempo.

**Contato (`Contact.astro`)**
Centralizado, `border-top: 1px solid var(--color-line)`, fundo com halo dourado radial `rgba(201,169,106,.10)` saindo do topo. Título Fraunces (sec-title) max 760px, texto `--ink-soft` 17px max 560px. **Botão primário de WhatsApp** (CTA pill) montando o link `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, `data-event="whatsapp_click"`. Abaixo, label "Ou marque uma call:" e o **embed inline do Cal.com**:

```html
<!-- Cal.com inline embed (tema escuro + brand dourado) -->
<div id="cal-inline" style="min-height:600px;width:100%;overflow:hidden"></div>
<script is:inline>
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", { origin: "https://cal.com" });
  Cal("inline", { elementOrSelector: "#cal-inline", calLink: import.meta.env.PUBLIC_CALCOM_LINK ?? "marcos/call", layout: "month_view" });
  Cal("ui", { theme: "dark", cssVarsPerTheme: { dark: { "cal-brand": "#c9a96a" } }, hideEventTypeDetails: false, layout: "month_view" });
</script>
```

(O `calLink` vem de `site.ts`/env. Confirmar o link real do Cal.com do Marcos antes do deploy.)

**Footer (`Footer.astro`)**
`border-top: 1px solid var(--color-line)`, `padding: 64px 0 40px`. Grid `1.4fr 1fr 1fr`: marca + linha "Produção audiovisual · Região dos Lagos · RJ" (`--ink-soft`), coluna de navegação, coluna de social (Instagram, YouTube, WhatsApp). Títulos de coluna (`h4`) 12px uppercase ls .18em cor `--accent`. Links `--ink-soft` → `--ink`. Faixa inferior com `border-top --line`, nome da marca à esquerda e "2026 © Todos os direitos reservados" à direita.

### 10.5 Animações e transições

```
TRANSIÇÃO PADRÃO:     .3s–.4s ease (cor, borda, transform)
HOVER LIFT (cards):   translateY(-4px) + borda acende (#33486e)
CTA HOVER:            fundo transparente → --accent, texto → navy, seta +4px
NAV SCROLL:           fundo .55 → .88 + borda transparente → --line (.4s)
REVEAL no scroll:     opacity 0 + translateY(26px) → opacity 1 + translateY(0), .9s ease, com stagger
MARQUEE logos:        translateX 0 → -50%, linear infinito ~35s, pausa no hover
CARROSSEL:            track rotate(-5deg) desktop; cursor "VER" segue o ponteiro com fade/scale
GROODE/GRÃO:          overlay fixo estático opacity .035
HALOS dourados:       radiais estáticos no hero (.12) e no contato (.10)
```

Reveal (igual ao protótipo, via IntersectionObserver): aplicar `.reveal` nos blocos, `threshold ~.12`, ao intersectar adiciona `.in` e dá `unobserve`. Stagger por índice (ex: `(i % 3) * 90ms` de delay). Respeitar `prefers-reduced-motion` (mostra tudo de cara).

### 10.6 Referências visuais

| Referência | O que inspira |
|---|---|
| alexledp.com (Alex Le, cinematographer) | carrossel de cases inclinado, cursor "VER", nome no hover, nav mínima, hero com nome grande |
| mse.tv (Helm Editorial) | rótulo de cada trabalho: cliente em cima, nome do projeto embaixo |
| movprodutora.com.br (MOV, Fortaleza) | discurso de método "começa antes da câmera", CTA de agendar conversa |
| Protótipo Damascena (aprovado) | sistema de cor de 7 tokens, Fraunces + Hanken, proporção 90/5 do dourado, grão, halos, reveal |

### 10.7 Modo

Dark only. Sem toggle.

### 10.8 Estrutura de tela (ordem das seções no index)

| # | Seção | Componente | Propósito |
|---|---|---|---|
| 1 | Nav | Nav.astro | navegação fixa, marca |
| 2 | Hero | Hero.astro | impacto + proposta + CTA |
| 3 | Cases | Cases.astro | prova imediata (o trabalho), carrossel diagonal |
| 4 | O que faz e como faz | Services.astro + Process.astro (mesma section) | serviços + método (híbrido) |
| 5 | Quem é o Marcos | About.astro | confiança, stats |
| 6 | Logos | Logos.astro | prova social (marquee) |
| 7 | FAQ | Faq.astro | quebra de objeção |
| 8 | Contato | Contact.astro | conversão (WhatsApp + Cal.com) |
| 9 | Footer | Footer.astro | navegação + social |

### 10.9 SEO, OG e dados estruturados (em `Base.astro`)

- `<html lang="pt-BR">`.
- `<title>`: `Damascena Films — Produção audiovisual estratégica · Região dos Lagos, RJ`.
- `meta description` focada em posicionamento + região.
- `canonical`, OG (`og:title`, `og:description`, `og:image` → `/og-image.jpg`, `og:type=website`, `og:url`), Twitter card `summary_large_image`.
- `favicon.svg`.
- JSON-LD `ProfessionalService` (ou `Person` + `LocalBusiness`): nome "Damascena Films", fundador Marcos, `areaServed` Região dos Lagos / RJ, `sameAs` com o Instagram, tipo de serviço produção audiovisual. Ajuda em busca local e reforça profissionalismo.

---

## 11. MANIFESTO DE SEGURANÇA — LER ANTES DE CODAR

### Nível de risco do sistema
**BAIXO.** Site estático, sem backend, sem banco, sem autenticação, sem dado sensível de usuário. Conversão por links externos (WhatsApp, Cal.com).

### Superfícies de ataque identificadas
- Embed de terceiro (Cal.com) carregando script externo.
- Links externos (WhatsApp, redes).
- IDs de tracking (públicos por natureza) quando forem adicionados.
- Dependências do build (supply chain).

### Regras imperativas
**Credenciais e config**
- NUNCA hardcodar chave privada, token ou segredo. Não há nenhum segredo neste projeto; os IDs de pixel/GTM são públicos e ficam em `.env` com prefixo `PUBLIC_`.
- `.env` no `.gitignore` antes do primeiro commit. NUNCA commitar `.env`.

**Entradas e endpoints**
- NÃO criar endpoint, API nem formulário com submit. Não há entrada de usuário a sanitizar.
- Se um dia entrar formulário, validar e sanitizar toda entrada no servidor antes de qualquer uso.

**Terceiros e links**
- Carregar o embed do Cal.com só pela URL oficial (`app.cal.com/embed/embed.js`). Não copiar script de fonte não oficial.
- Todo link externo com `rel="noopener noreferrer"`.

**Dependências**
- Fixar versões no `package.json`. Rodar `npm audit` antes do deploy. Não adicionar dependência fora das listadas na seção 2.

**Cabeçalhos (no deploy, via Cloudflare Pages)**
- Configurar headers de segurança: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, e um CSP que permita os domínios do Cal.com, YouTube/Vimeo (iframe do lightbox) e os assets próprios.

### Checklist pré-deploy
- [ ] Nenhum segredo no código (não deve haver nenhum mesmo).
- [ ] `.env` não commitado.
- [ ] Nenhum endpoint ou formulário com submit criado.
- [ ] Embed do Cal.com só pela URL oficial.
- [ ] Links externos com `rel="noopener noreferrer"`.
- [ ] `npm audit` sem vulnerabilidade alta/crítica.
- [ ] iframe do vídeo só carrega ao abrir o lightbox e é removido ao fechar.
- [ ] Headers de segurança configurados no Cloudflare Pages.
- [ ] Lighthouse 95+ Performance, 100 Acessibilidade e SEO.
