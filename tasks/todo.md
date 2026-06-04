# TODO — Landing Page Damascena Films

Build do PRD `prd-damascena-films-landing.md`. Stack: Astro 5 + Tailwind 4 (CSS-first) + TS strict, feature-sliced (modular-arch). Plano: `~/.claude/plans/resilient-stargazing-hellman.md`.

## Passos

- [x] **0. Git** — `git init -b main` + remote `lp-marcos` + `.gitignore` (sem push até o fim)
- [x] **1. Scaffold** — package.json (deps fixadas), astro.config (@tailwindcss/vite), tsconfig strict, .env/.env.example, env.d.ts, public/ skeleton, favicon
- [x] **2. Tokens + shared** — global.css (@theme 7 cores + 2 fontes, grão, .reveal, .wrap, reduced-motion, sr-only); shared/ui (CtaButton, RichText), shared/lib (richtext, track, reveal), shared/config/site.ts, shared/analytics
- [x] **3. Base + Nav** — Base.astro (head SEO/OG/JSON-LD, fontes, mount reveal+track); Nav (fixa, blur, .scrolled, drawer mobile)
- [x] **4. Hero** — eyebrow, h1 ".Films" itálico dourado, role, lede RichText, CTA, moldura retrato, halo
- [x] **5. Cases** — carrossel diagonal -5/-2deg, cursor "VER", lightbox (iframe on-open/destroy-on-close, focus-trap, Esc, restore), teclado
- [x] **6. Services + Process** — mesma `<section id="servicos">`; cards hover; método com números dourados 64px
- [x] **7. About** — stats dourados + parágrafos Fraunces com destaques
- [x] **8. Logos + FAQ** — marquee infinito (set duplicado, pausa hover); accordion `<details>` nativo, marcador +/− dourado
- [x] **9. Contato + Footer** — WhatsApp CTA + embed Cal.com (resolveCalLink via define:vars, placeholder elegante se sem slug); footer 3 colunas
- [x] **10. SEO/OG/JSON-LD + tracking** — head completo, ProfessionalService, og-image.jpg gerado (sharp), data-event + listener delegado
- [x] **11. QA** — build exit 0, Lighthouse, interações, responsivo, reduced-motion, audit

## Review

**Resultado:** Landing one-pager completa, 9 seções, fiel ao design system do PRD (navy 90% · dourado <5% · Fraunces+Hanken · grão · carrossel diagonal). Rodando em `http://localhost:4321`.

**Verificação (provado, não assumido):**
- **Build de produção:** exit 0, estático, zero erro.
- **Lighthouse mobile (build prod):** Performance **97** · Acessibilidade **100** · SEO **100** · Best Practices **100** · 0 audits falhando. Métricas: LCP ~2.1s, **CLS 0.02**, TBT 0ms.
- **Interações (puppeteer):** lightbox abre no clique → iframe youtube-nocookie+autoplay → body travado → Esc fecha e **destrói o iframe** (corta som) → body restaurado; cards são `<button>` focáveis; reduced-motion → marquee estático + 36 reveals imediatos.
- **Responsivo:** 1440 / 768 / 390 sem quebra (breakpoint único 880px).
- **Correções de a11y aplicadas:** contraste dos logo-chips (removida opacity .5), heading-order (footer h4→h3), label-in-name (removido aria-label conflitante dos cards + brand, sr-only "Abrir vídeo:").

**Decisão de arquitetura:** modular-arch real — cada seção em `src/modules/<feature>/` com UI+dados+tipos+lógica; `src/shared/` só agnóstico; `src/pages/index.astro` pura composição.

**Resolvido do PRD:** armadilha do Cal.com (link lido de 3 fontes) → `PUBLIC_CALCOM_LINK` + `resolveCalLink()` + `define:vars`; sem imagens reais → placeholders em gradiente com dimensões explícitas (CLS~0), prontos pra `<Image>`.

**Pendências pro Marcos (placeholders):** número real do WhatsApp, slug do Cal.com (`PUBLIC_CALCOM_LINK`), stills dos cases (retrato), logos dos clientes, foto do Marcos, números dos stats, og-image final (o gerado é um placeholder premium).

**Nota de segurança:** `npm audit` = 1 vuln **moderada** no Astro (XSS em define:vars / Server Islands) — **não explorável aqui** (define:vars só com slug controlado pelo dev; sem Server Islands). Fix exigiria Astro 6 (breaking, viola stack 5.x do PRD §2). Dentro do critério do PRD §11 (sem alta/crítica). Reportado, não troquei o stack por conta própria.
