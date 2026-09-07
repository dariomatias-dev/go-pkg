<p align="center">
  <strong>Idioma:</strong> <a href="contributing.md">English</a> | Português (BR) | <a href="contributing.es.md">Español</a>
</p>

# Contribuindo

## Configuração

```bash
git clone https://github.com/dariomatias-dev/go-pkg.git
cd go-pkg
pnpm install
cp .env.example .env   # preencha ao menos GEMINI_API_KEY
git config core.hooksPath .githooks
```

A linha `core.hooksPath` ativa um hook `commit-msg` que rejeita commits
fora da [convenção de commit](#convenção-de-commit) abaixo. As versões
de Node e pnpm estão fixadas via `.nvmrc`, `engines` e `packageManager`
no `package.json` - use elas (`nvm use`) em vez do que estiver no
`PATH` por acaso.

## Antes de abrir um PR

Rode o gate local - ele espelha o CI passo a passo, então uma execução
verde aqui significa que o CI não tem motivo novo pra falhar:

```bash
./scripts/verify.sh              # format, lint, typecheck, test:coverage, build
./scripts/verify.sh --skip-build # loop mais rápido durante iteração
```

Checklist:

- [ ] `./scripts/verify.sh` passa.
- [ ] Lógica nova em `lib/` ou `hooks/` tem teste (veja
      [architecture.md](architecture.md) pra saber o que pertence a cada
      camada).
- [ ] Mudança de comportamento numa rota de API tem teste atualizado ou
      novo em `app/api/**/*.test.ts`.
- [ ] Mudança de UI que afeta um fluxo visível ao usuário tem um smoke
      test E2E (`pnpm e2e`) ou atualização de um existente.
- [ ] O assunto do commit segue a [convenção](#convenção-de-commit)
      abaixo - o hook `commit-msg` garante isso localmente, mas confira
      antes de dar push se os hooks não estiverem configurados.

## Convenção de commit

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org):

```
<tipo>(<escopo>): <assunto>
```

- **tipo**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `build`, `ci`, `revert`
- **escopo**: opcional, minúsculo, ex: `search`, `compare`, `readme`
- **assunto**: modo imperativo, sem ponto final, ≤72 caracteres

Exemplos:

```
feat(compare): add dependency count column
fix(popular-package): handle GitHub API rate limit errors
docs(readme): document available npm scripts
```

O corpo (opcional) explica o _por quê_, não o _o quê_ - o diff já mostra
o que mudou.

## Branches

- `main` é protegida: sem push direto, merge só via pull request.
- Nomes de branch: `<tipo>/<descrição-curta>` (ex: `feat/tag-filter`,
  `fix/search-pagination`).
- Checks obrigatórios na `main`: `verify` e `e2e` (os jobs
  `vulnerabilities` e `lighthouse` reportam mas não bloqueiam - veja a
  tabela abaixo).
- Merge só squash ou rebase - sem merge commits, pra manter o
  histórico linear e cada entrada um Conventional Commit válido.
- Neste repositório (mantenedor único), self-merge após o CI passar é
  permitido; a proteção de branch ainda exige o fluxo de PR e os
  checks passando.

## O que o CI checa

| Job               | O que faz                                                                                                      | Bloqueia merge?                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `verify`          | `format:check` → `lint` → `typecheck` → `test:coverage` → `build`, nessa ordem (checagem mais rápida primeiro) | Sim                                                                           |
| `vulnerabilities` | `osv-scanner` contra `pnpm-lock.yaml`                                                                          | Não - um aviso recém-divulgado sem correção ainda não deveria travar todo PR  |
| `e2e`             | Smoke flows do Playwright em Chromium e WebKit, `needs: verify`                                                | Sim                                                                           |
| `lighthouse`      | Lighthouse CI contra o app buildado, só relatório                                                              | Não - nenhum orçamento de performance foi calibrado contra tráfego real ainda |

## Reproduzindo o CI localmente com `act`

O [`act`](https://github.com/nektos/act) roda o workflow do GitHub
Actions num container Docker local. O `.actrc` já está configurado com
uma imagem de runner próxima o bastante da do GitHub pra pegar a
maioria das diferenças de ambiente:

```bash
act pull_request -j verify
```

É mais lento que `./scripts/verify.sh` (builda uma imagem de container
primeiro) - use quando precisar debugar algo que só falha no CI, não
como loop do dia a dia.

## Triando um PR do Renovate

- Se ele mexe num dos pacotes fixados em
  [dependencies.md](dependencies.md), feche e confira se a regra
  `enabled: false` do `renovate.json` pra aquele pacote está faltando
  ou desatualizada - esse é o bug de verdade, não o PR.
- Caso contrário: confira a própria descrição do PR (o Renovate inclui
  o diff do changelog), rode `./scripts/verify.sh`, e faça merge se
  estiver verde. Um PR agrupado (ex: `react` + `@types/react*` juntos)
  deve ser revisado como uma unidade só - não separe commits dele.
- Um PR de bump de versão major recebe revisão normal, não carimbo
  automático: leia o changelog em busca de mudanças quebradoras antes
  de fazer merge.

## Trabalhando com um agente de IA

Este repositório tem `AGENTS.md` (e `CLAUDE.md`, que reexporta ele) na
raiz, lido automaticamente por agentes de código que suportam a
convenção. Hoje ele afirma que a versão fixada do Next.js divergiu do
que está nos dados de treinamento da maioria dos modelos, e aponta pra
`node_modules/next/dist/docs/` como fonte da verdade pro comportamento
do framework - esse diretório vem junto com o próprio pacote `next` e
está mais atualizado que a documentação pública indexada antes dessa
fixação.

Se você está usando um agente pra contribuir:

- Trate `node_modules/next/dist/docs/` como autoridade acima do
  conhecimento de treinamento do agente pra qualquer coisa específica
  do Next.js - convenções de route de API, a convenção de arquivo
  `proxy.ts`, a semântica de `cacheLife`/Cache Components, e as regras
  de arquivos de metadata (veja a nota sobre rotas catch-all e
  `opengraph-image.tsx` em [architecture.md](architecture.md)).
- Uma explicação plausível de um agente sobre _por que_ algo está
  fixado ou estruturado de certa forma ainda deve ser conferida contra
  [dependencies.md](dependencies.md) e este arquivo - prefira atualizar
  a documentação a deixar um raciocínio não documentado divergir do
  código.
- Rode `./scripts/verify.sh` você mesmo antes de confiar na afirmação
  de um agente de que uma mudança está verde.

## Estilo de código

Segue a config de ESLint do projeto (`eslint.config.mjs`) e a config
do Prettier (`.prettierrc.json`) - as duas rodam como parte de
`./scripts/verify.sh`, então não há um guia de estilo separado pra
manter sincronizado à mão.
