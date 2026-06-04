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
