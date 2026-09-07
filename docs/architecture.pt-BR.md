<p align="center">
<a href="architecture.md">English</a> · <a href="architecture.es.md">Español</a> · <strong>Português (BR)</strong>
</p>

# Arquitetura

Este documento descreve o sistema como ele é hoje. Qualquer coisa ainda
não implementada pertence a uma issue, não aqui.

## Árvore de diretórios

```
app/                  Rotas (Next.js App Router). Páginas, layouts,
                       route handlers de API, sitemap.ts, robots.ts.
  api/                 Route handlers - único lugar autorizado a ler
                       segredos (GITHUB_TOKEN, GEMINI_API_KEY) ou
                       escrever em lib/api/*.
  package/[...importPath]/  Página de detalhe do pacote. É um segmento
                       catch-all porque o import path do Go tem barras
                       (ex: golang.org/x/net).

components/            Componentes React, agrupados pela página/feature
                       dona (home/, search/, compare/, package/,
                       favorites/, popular/) mais grupos compartilhados:
  common/              UI genérica reutilizada entre features
                       (Pagination, SearchHistoryDropdown) que não é
                       uma primitiva de design pura.
  layout/              Header, Footer, nav-links - a casca da página.
  providers/           Providers de cliente globais do app (tema,
                       restauração de scroll).
  ui/                  Primitivas de design (button, select, tooltip,
                       dropdown-menu) - em sua maioria geradas pelo
                       shadcn, genéricas o bastante pra não saber nada
                       sobre pacotes Go.

hooks/                 Hooks React client-side (useFavorites,
                       usePackageDetail) - estado e acesso a APIs de
                       navegador que um Server Component não pode fazer
                       diretamente.

lib/                   Lógica agnóstica de framework: sem JSX, sem hooks
                       React.
  api/                 Suporte a route handlers: schemas zod, o
                       envelope de resposta { error: { code, message } },
                       o rate limiter em memória.
  github/               Cliente REST do GitHub + Go Module Proxy,
                       normalização de resposta, a tabela de mapeamento
                       de vanity imports, resilientFetch (timeout +
                       retry).

types/                  Tipos TypeScript compartilhados, sem código em
                       runtime.
```

## Regra de camadas

```
app/  →  components/  →  hooks/  →  lib/  →  types/
```

Uma seta significa "pode importar de". A regra só vale numa direção:

- `lib/` nunca importa de `components/`, `hooks/` ou `app/` - não tem
  JSX nem React, então dá pra testar com Vitest puro, sem DOM (veja
  `lib/**/*.test.ts`).
- `hooks/` pode usar `lib/` e APIs de navegador, mas não é preso a uma
  página específica - `useFavorites` é compartilhado entre a home, o
  card de pacote e o cabeçalho do detalhe do pacote.
- `components/` pode usar `hooks/` e `lib/`, nunca o contrário.
- `app/` compõe `components/` nas rotas e é dona da busca de dados dos
  Server Components; é a única camada autorizada a chamar
  `getPackageDetail` ou um schema de `lib/api/*` diretamente fora de um
  route handler.

`types/` fica fora dessa cadeia de setas: qualquer camada pode importar
um tipo, e tipos nunca importam de nada além de outros tipos.

## Fronteira Server / Client Component

O `page.tsx` de cada rota é um Server Component por padrão. Ele busca os
dados (via `lib/github` ou `lib/github/cached`) e renderiza. No momento
em que um componente precisa de `useState`, `useEffect`, `onClick` ou
uma API de navegador (`localStorage`, `window`), ele vira `"use client"`
e é empurrado o mais fundo possível na árvore - a própria página de
busca continua sendo um Server Component; `SearchSection` (que é dona do
estado de paginação e do fetch com debounce pra `/api/search`) é a
fronteira de cliente.

A página de detalhe do pacote (`app/package/[...importPath]/page.tsx`) é
uma exceção parcial: ela busca os dados do pacote no servidor duas
vezes, para dois propósitos diferentes - uma para `generateMetadata`
(título/tags OG) e outra para a tag `<script>` de JSON-LD renderizada no
corpo da página - enquanto a UI interativa de fato (`PackageDetail`) é
um client component que busca `/api/package-info` de novo,
independentemente, ao montar. As duas buscas no servidor passam pelo
mesmo wrapper `getCachedPackageDetail` (`lib/github/cached.ts`)
justamente pra compartilhar uma única entrada de cache em vez de pagar
o custo do fetch de GitHub/Go-proxy/README duas vezes.

## Estratégia de cache

Três camadas, cada uma resolvendo um problema diferente:

1. **`"use cache"` + `cacheLife`** (Next.js Cache Components) - usado
   dentro dos route handlers de API e da página de detalhe do pacote
   pra cachear o _resultado do fetch caro em si_ (GitHub API + Go Proxy
   - scraping de README pode significar uma dezena de requisições
     externas pra um único pacote). Cada função cacheada define seu
     próprio `cacheLife({ revalidate: <segundos> })`: 30 min pra detalhes
     de pacote, 1 hora pra busca/versões/releases/populares, 1 dia pro
     resumo de IA e a nota do Go Report Card (mudam raramente e custam
     cota real de API pra regenerar).
2. **Headers HTTP `Cache-Control`** na resposta do route handler -
   deixa navegadores, CDNs e o `fetch()` do cliente pularem a ida à
   rede completamente com cache quente, independente do cache do
   servidor acima. O `s-maxage` bate com o valor de `cacheLife` da
   rota.
3. **`localStorage`**, para estado que é genuinamente por navegador e
   não tem representação no servidor: favoritos (`useFavorites`),
   histórico de pacotes visitados e histórico de busca. Não existe
   sistema de contas nem banco de dados - favoritos e histórico ficam
   deliberadamente restritos a um único navegador, não é uma lacuna do
   produto a preencher depois.

## Mapeamento de vanity imports

`lib/github/client.ts` mapeia uma lista fixa de vanity import paths do
Go (`go.uber.org/zap`, `golang.org/x/net`, `gopkg.in/yaml.v3`, …) pro
`owner/repo` real no GitHub. É uma **tabela estática**, não uma
resolução dinâmica (seguindo a meta tag `go-import` do vanity import ou
o redirect `?go-get=1`), por dois motivos:

- **Determinismo sob uma CSP estrita.** Resolver um vanity import
  dinamicamente significa buscar uma página HTML arbitrária de
  terceiros e parsear uma meta tag antes mesmo da requisição real
  começar - um salto de rede extra com seus próprios modos de falha,
  orçamento de timeout e (se raspado sem cuidado) superfície de
  injeção.
- **É uma lista curta e conhecida.** O ecossistema Go tem um número
  pequeno de domínios de vanity import populares. Quando um novo
  aparece com frequência suficiente pra importar, é uma linha a mais
  na tabela, não um novo mecanismo de resolução.

Um import path que não está na tabela e ainda não é `github.com/...` é
assumido como `github.com/<path>` diretamente (`parseGithubRepo`). Essa
suposição vale pra grande maioria dos pacotes Go e falha silenciosamente
(retorna `null`, quem chama degrada graciosamente) pro resto.

## Rate limiting

`lib/api/rate-limit.ts` implementa um contador de janela fixa, em
memória (10 requisições/minuto por IP de cliente), aplicado em
`package-summary` e `package-assistant` - as duas rotas que gastam cota
da API do Gemini a cada requisição.

**Limitação conhecida:** o contador vive na memória do processo Node.
Numa plataforma serverless que roda múltiplas instâncias concorrentes
(o que a Vercel faz sob carga), cada instância aplica o limite de forma
independente, então o limite _efetivo_ é `10 × número de instâncias`,
não um teto global rígido de 10. Isso é aceitável na escala atual do
projeto - impede abuso trivial de um único cliente, que era o problema
real - mas não é um rate limiter distribuído. Um conserto de verdade
moveria o contador pra um armazenamento compartilhado (Redis, Vercel
KV), e está fora de escopo até o consumo de cota virar um problema de
fato em produção.

## Cliente HTTP resiliente

`resilientFetch` (`lib/github/client.ts`) envolve toda chamada externa
ao GitHub, ao Go Module Proxy, ao `raw.githubusercontent.com` e ao
goreportcard.com com:

- Um timeout de requisição (`AbortSignal.timeout`), pra uma resposta
  lenta upstream não segurar a rota até o próprio timeout da
  plataforma matar ela.
- Retry com backoff exponencial, mas **só** pra respostas 5xx e erros
  de rede - um 4xx nunca é reenviado, já que reenviar um erro de
  cliente só repete a mesma falha.
- Respeito ao header `Retry-After` em 403/429 (respostas de rate limit
  do GitHub), limitado a 10 segundos pra uma rota nunca ficar pendurada
  esperando um cooldown arbitrariamente longo do upstream.

O loop de varredura de README em `getPackageDetail` (que tenta até 5
branches × 5 nomes de arquivo) chama ele com `retries: 0` de propósito

- com até 25 tentativas já, adicionar retry em cima multiplicaria um
  pior caso que já é caro.
