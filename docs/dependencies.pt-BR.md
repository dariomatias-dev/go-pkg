<p align="center">
  <strong>Idioma:</strong> <a href="dependencies.md">English</a> | Português (BR) | <a href="dependencies.es.md">Español</a>
</p>

# Dependências fixadas

A maioria das dependências em `package.json` usa faixa com `^` e
atualiza livremente via Renovate. As entradas abaixo estão fixadas numa
versão exata (sem `^`) de propósito. Cada uma responde: o que é, por que
está fixada, o que quebra se a fixação for removida, e o que remove a
fixação.

## `next` - `16.2.11`

**O quê:** o próprio framework.

**Por que está fixada:** este projeto roda uma versão bem recente do
Next.js com Cache Components (`cacheComponents: true`, `"use cache"` +
`cacheLife`) e acompanha o framework de perto o bastante pra já ter
esbarrado numa mudança de nome quebradora no meio do desenvolvimento: a
convenção de arquivo `middleware.ts` foi renomeada pra `proxy.ts` numa
release pontual, descoberta só ao ler `node_modules/next/dist/docs/`
diretamente, porque a mudança ainda não tinha se propagado pra
documentação pública indexada no treinamento de assistentes de código
com IA (veja `AGENTS.md`). Uma faixa com `^` num framework se movendo
nessa velocidade arrisca puxar outra mudança de nome desse tipo, uma
mudança na semântica dos Cache Components, ou uma alteração no
comportamento do App Router sem uma revisão deliberada do changelog
antes.

**O que quebra se destravar:** nada hoje - mas a próxima release do
`next` pode mudar a semântica de cache dos Cache Components, renomear
outra convenção de arquivo, ou alterar como `generateMetadata`/
`opengraph-image.tsx` interagem com uma rota catch-all (veja a nota em
[architecture.md](architecture.md) sobre por que imagens OG dinâmicas
por pacote não são possíveis). Qualquer uma dessas apareceria como
falha de build ou mudança silenciosa de comportamento, não como erro de
tipo.

**O que remove a fixação:** um upgrade deliberado - ler as release notes
(e reconferir `node_modules/next/dist/docs/` por qualquer coisa ainda
não publicada no site público) de cada versão minor entre a fixação
atual e o alvo, subir `next` e `eslint-config-next` juntos, rodar
`./scripts/verify.sh`, e atualizar esta entrada com o novo raciocínio.

## `eslint-config-next` - `16.2.11`

**O quê:** as regras de ESLint publicadas pelo time do Next.js pra
projetos App Router.

**Por que está fixada:** precisa bater exatamente com a versão do
`next` - a config que ela exporta é gerada contra uma release
específica do framework e não tem garantia de compatibilidade entre
versões.

**O que quebra se destravar:** regras de lint referenciando APIs do
Next.js removidas ou renomeadas, ou faltando regras pras novas -
inconsistente, não é uma falha dura, mas vale evitar.

**O que remove a fixação:** sempre subida no mesmo commit que o `next`,
nunca de forma independente.

## `react` / `react-dom` - `19.2.4`

**O quê:** o runtime de UI.

**Por que está fixada:** os Cache Components e o Partial Prerendering do
Next 16.2.11 dependem de internals específicos do React (os que
permitem uma página ter um shell estático com uma região transmitida
dinamicamente). O próprio Next fixa uma faixa estreita e compatível de
React exatamente por isso, e este projeto espelha essa fixação em vez
de deixar o Renovate mover o React de forma independente do Next, o
que poderia combinar uma versão de React contra a qual o Next 16.2.11
não foi construído.

**O que quebra se destravar:** possivelmente nada num bump de patch,
mas não há garantia - internals do React usados pelos Cache Components
não fazem parte do contrato público de estabilidade do React da mesma
forma que as APIs de componente fazem.

**O que remove a fixação:** subida junto com o `next`, depois de
conferir o `package.json` da versão alvo do Next pra ver a faixa de
React contra a qual ele foi construído e testado.

## Configuração do Renovate

Uma vez que o Renovate estiver configurado (`renovate.json`), ele deve
desabilitar atualizações pra esses quatro pacotes explicitamente, cada
regra com sua `description` apontando de volta pra este arquivo. Até
lá, um PR do Renovate propondo subir um deles individualmente é um
sinal de que este documento está desatualizado - reconcilie os dois em
vez de aceitar o PR às cegas.
