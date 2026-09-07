<p align="center">
  <strong>Idioma:</strong> <a href="security.md">English</a> | Português (BR) | <a href="security.es.md">Español</a>
</p>

# Política de Segurança

## Versões suportadas

Este projeto não tem branches de versão de fato - `main` é a única
versão suportada, e uma correção sai como um commit novo lá, não é
retroportada pra lugar nenhum.

## Escopo

Antes de reportar, repare no que este app realmente é: um catálogo
público e somente-leitura de metadados de pacotes Go. Não existe
**sistema de contas, estado de usuário no servidor, nem banco de
dados** - favoritos e histórico de busca vivem inteiramente no
navegador de quem visita (`localStorage`), nunca são enviados ao
servidor. Isso descarta uma categoria de reports (fixação de sessão,
tomada de conta, XSS armazenado via perfil de usuário, IDOR em dados de
usuário) que não se aplicam porque a superfície que eles mirariam não
existe aqui. Veja [architecture.md](architecture.md) pro quadro
completo.

O que **está** no escopo: o app web público e suas rotas de API
(`app/api/**`), incluindo validação de entrada, a integração com as
APIs do GitHub/Gemini, a Content-Security-Policy e outros headers de
segurança (`next.config.ts`), e a cadeia de dependências
(`pnpm-lock.yaml`, escaneada automaticamente pelo `osv-scanner` no CI -
veja [contributing.md](contributing.md)).

## Reportando uma vulnerabilidade

Por favor, **não** abra uma issue pública no GitHub pra um report de
segurança.

Preferencial: use os
[Security Advisories](https://github.com/dariomatias-dev/go-pkg/security/advisories/new)
privados do GitHub para este repositório.

Alternativa: envie um email pra **dariomatias.dev@gmail.com** com uma
descrição do problema.

Inclua, se puder:

- A rota ou componente afetado.
- Passos pra reproduzir, ou uma prova de conceito mínima.
- O impacto como você vê - o que um atacante conseguiria fazer com
  isso de fato.

## O que esperar

Este é um projeto de mantenedor único, escala de portfólio. Não existe
SLA formal, e prometer um seria desonesto. Na prática: um report com
reprodução clara é reconhecido e olhado prontamente, mas "prontamente"
aqui significa "quando o mantenedor estiver disponível", não uma
janela contratual de resposta. Se o projeto algum dia crescer pra um
time, esta seção é a primeira coisa que deveria mudar.
