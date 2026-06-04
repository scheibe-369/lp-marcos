# Lessons

## L001 — `modular-arch` é regra de governança, não "skill de frontend"
**Contexto:** Ao listar minhas skills, classifiquei `modular-arch` como mais uma skill da categoria "Design & Frontend". O usuário corrigiu: ela dita COMO eu devo trabalhar.

**Padrão errado:** Tratar `modular-arch` como opcional/frontend-only ou como item de lista.

**Regra para mim:**
- `modular-arch` governa QUALQUER trabalho de código — frontend, backend, APIs, jobs, scripts, infra. Não só UI.
- Invocá-la no INÍCIO de toda task de criação/refactor, ANTES de escrever código.
- Isolar cada elemento em seu próprio módulo/feature folder. NUNCA poluir pastas globais (`components/`, `lib/`, `utils/`, `services/`, `api/`, `handlers/`, `routes/`) com lógica de feature específico.
- Cada feature = vertical coesa (UI + lógica + dados + tipos), desacoplada do resto.
- Ao falar das minhas capacidades, apresentá-la como mandato de workflow — não como "mais uma opção".

## L002 — Mask gradient esconde muito da imagem; "X% da caixa" ≠ "X% visível"
**Contexto:** No hero, pus a imagem com `width: 40%` mas um `mask-image` que desbotava 38% da esquerda. O usuário viu uma fatia fina ("ta mt menor q 40") — porque o visível era ~25% da tela, não 40%. Pior ainda sendo placeholder navy-sobre-navy (quase some).

**Regra para mim:**
- Largura da caixa ≠ área visível quando há `mask-image`/fade. Se eu disser "X%", o usuário espera ver ~X% — então o fade deve ser uma borda fina (ex: 12-15%), não comer metade.
- Placeholder de imagem precisa ser **claramente visível** (gradiente distinto do fundo) pra pessoa julgar tamanho/posição. Navy-sobre-navy com blend forte = invisível.
- O blend "derrete no fundo" fica bom **com foto real**; em placeholder, segura a mão no fade.
- Ao reportar tamanho, falar do que é VISÍVEL, não do valor do CSS.
