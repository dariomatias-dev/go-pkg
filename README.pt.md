<br>
<div align="center">
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini">
</div>
<br>

<p align="center">
  <strong>Idioma:</strong> <a href="README.md">English</a> | Português
</p>

<h1 align="center">GoPkg</h1>

<p align="center">
  Uma plataforma moderna de descoberta e exploração de pacotes Go. Pesquise o ecossistema, inspecione detalhes de pacotes, compare bibliotecas lado a lado e obtenha insights com IA.
  <br>
  <a href="#sobre-o-projeto"><strong>Explorar a documentação »</strong></a>
  <br>
  <br>
  <a href="https://github.com/dariomatias-dev/go-pkg/issues">Reportar Bug</a> ·
  <a href="https://github.com/dariomatias-dev/go-pkg/issues">Solicitar Funcionalidade</a>
</p>

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Começar](#como-começar)
- [Licença](#licença)
- [Autor](#autor)

## Sobre o Projeto

GoPkg é uma plataforma web para descoberta e exploração de pacotes Go, construída como uma alternativa prática ao [pkg.go.dev](https://pkg.go.dev).

Ela agrega dados da API do GitHub e do Go Module Proxy oficial para fornecer metadados ricos sobre pacotes: estrelas, forks, licença, README, conteúdo do `go.mod`, histórico completo de versões, releases do GitHub e notas do Go Report Card: tudo em uma única interface.

A plataforma também integra o **Gopher AI**, um assistente de chat baseado no Google Gemini 2.5 Flash capaz de explicar qualquer pacote, gerar exemplos de código Go idiomático e responder dúvidas gerais sobre Go com contexto.

## Funcionalidades

- **Busca de Pacotes**: Busca por texto completo com filtros por categoria, tag e ordem (estrelas, forks, última atualização).
- **Detalhe do Pacote**: Metadados completos: descrição, estrelas, forks, licença, README, `go.mod`, lista de versões e releases do GitHub.
- **Go Report Card**: Nota de qualidade de código (A+–F) obtida do [goreportcard.com](https://goreportcard.com).
- **Pacotes Populares**: Repositórios Go em alta ranqueados por estrelas no GitHub, enriquecidos com metadados do Go Proxy.
- **Comparar**: Comparação lado a lado de múltiplos pacotes com métricas-chave.
- **Favoritos**: Salve pacotes localmente para referência rápida.
- **Gopher AI**: Assistente de chat contextual focado em um pacote específico ou em Go de forma geral.
- **Resumo com IA**: Resumo técnico gerado automaticamente com propósito, funcionalidades principais, exemplo de uso e casos comuns.
- **Modo Escuro / Claro**: Tema baseado no sistema com alternância manual.

## Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework React com App Router, React Server Components e cache integrado.
- **[React](https://react.dev/)**: Biblioteca de UI para construção de interfaces baseadas em componentes.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset tipado do JavaScript.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário para desenvolvimento ágil de UI.
- **[shadcn/ui](https://ui.shadcn.com/)**: Biblioteca de componentes acessíveis construída sobre o Radix UI.
- **[Google Gemini](https://ai.google.dev/)**: Modelo de IA que alimenta o Gopher AI e os resumos de pacotes.
- **[GitHub REST API](https://docs.github.com/en/rest)**: Metadados de repositórios, releases e conteúdo do README.
- **[Go Module Proxy](https://proxy.golang.org/)**: Listas de versões, arquivos `go.mod` e contagem de dependências.

## Como Começar

Siga os passos abaixo para executar o projeto localmente.

### Pré-requisitos

- Node.js 20+
- pnpm

### Instalação

Clone o repositório:

```bash
git clone https://github.com/dariomatias-dev/go-pkg.git
```

Acesse o diretório do projeto:

```bash
cd go-pkg
```

Instale as dependências:

```bash
pnpm install
```

### Variáveis de Ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GEMINI_API_KEY` | Sim | Chave da API do Google Gemini para o Gopher AI e resumos de pacotes. Obtenha uma em [aistudio.google.com](https://aistudio.google.com). |
| `GITHUB_TOKEN` | Não | Token de acesso pessoal do GitHub. Eleva o limite de requisições da API de 60 para 5.000 por hora. Gere um em [github.com/settings/tokens](https://github.com/settings/tokens): nenhuma permissão especial é necessária para repositórios públicos. |

### Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar o resultado.

## Licença

Distribuído sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

## Autor

Desenvolvido por **Dário Matias**:

- **Portfólio**: [dariomatias-dev.com](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **E-mail**: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
