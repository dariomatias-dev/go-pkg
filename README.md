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
  <strong>Language:</strong> English | <a href="README.pt-BR.md">Português (BR)</a> | <a href="README.es.md">Español</a>
</p>

<h1 align="center">GoPkg</h1>

<p align="center">
  A modern Go package discovery and exploration platform. Search the ecosystem, inspect package details, compare libraries side-by-side, and get AI-powered insights.
  <br>
  <a href="#about-the-project"><strong>Explore the docs »</strong></a>
  <br>
  <br>
  <a href="https://github.com/dariomatias-dev/go-pkg/issues">Report Bug</a> ·
  <a href="https://github.com/dariomatias-dev/go-pkg/issues">Request Feature</a>
</p>

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## About the Project

GoPkg is a web platform for discovering and exploring Go packages, built as a practical alternative to [pkg.go.dev](https://pkg.go.dev).

It aggregates data from the GitHub API and the official Go Module Proxy to provide rich package metadata: stars, forks, license, README, `go.mod` contents, full version history, GitHub releases, and Go Report Card grades: all in one interface.

The platform also integrates **Gopher AI**, a chat assistant powered by Google Gemini 2.5 Flash that can explain any package, generate idiomatic Go code examples, and answer general Go questions in context.

## Features

- **Package Search**: Full-text search with filtering by category, tag, and sort order (stars, forks, last updated).
- **Package Detail**: Complete metadata: description, stars, forks, license, README, `go.mod`, version list, and GitHub releases.
- **Go Report Card**: Code quality grade (A+–F) sourced from [goreportcard.com](https://goreportcard.com).
- **Popular Packages**: Trending Go repositories ranked by GitHub stars, enriched with Go Proxy metadata.
- **Compare**: Side-by-side comparison of multiple packages across key metrics.
- **Favorites**: Bookmark packages locally for quick reference.
- **Gopher AI**: Context-aware chat assistant scoped to a specific package or to Go in general.
- **AI Summary**: Auto-generated technical summary with purpose, key features, usage example, and common use cases.
- **Dark / Light Mode**: System-aware theme with manual override.

## Built With

- **[Next.js](https://nextjs.org/)**: React framework with App Router, React Server Components, and built-in caching.
- **[React](https://react.dev/)**: UI library for building component-driven interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[shadcn/ui](https://ui.shadcn.com/)**: Accessible component library built on Radix UI.
- **[Google Gemini](https://ai.google.dev/)**: AI model powering Gopher AI and package summaries.
- **[GitHub REST API](https://docs.github.com/en/rest)**: Repository metadata, releases, and README content.
- **[Go Module Proxy](https://proxy.golang.org/)**: Version lists, `go.mod` files, and dependency counts.

## Screenshots

<div align="center">
  <img src="public/screenshots/home.png" width="400" alt="Home"/>
  <img src="public/screenshots/search.png" width="400" alt="Search"/>
  <img src="public/screenshots/popular.png" width="400" alt="Popular Packages"/>
  <img src="public/screenshots/package-detail.png" width="400" alt="Package Detail"/>
  <img src="public/screenshots/compare.png" width="400" alt="Compare"/>
  <img src="public/screenshots/favorites.png" width="400" alt="Favorites"/>
</div>

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js 20+
- pnpm

### Installation

Clone the repository:

```bash
git clone https://github.com/dariomatias-dev/go-pkg.git
```

Navigate into the project directory:

```bash
cd go-pkg
```

Install the required packages:

```bash
pnpm install
```

### Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable         | Required | Description                                                                                                                                                                                                  |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key for Gopher AI and package summaries. Get one at [aistudio.google.com](https://aistudio.google.com).                                                                                    |
| `GITHUB_TOKEN`   | No       | GitHub personal access token. Raises the API rate limit from 60 to 5,000 requests/hour. Generate one at [github.com/settings/tokens](https://github.com/settings/tokens): no scopes needed for public repos. |

### Running the Project

To start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the result.

## Scripts

| Script       | Command           | Description                                                                                                                                           |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`        | `pnpm dev`        | Starts the development server with hot reload.                                                                                                        |
| `build`      | `pnpm build`      | Creates an optimized production build.                                                                                                                |
| `start`      | `pnpm start`      | Runs the production build. Requires `pnpm build` first.                                                                                               |
| `lint`       | `pnpm lint`       | Runs ESLint across the project.                                                                                                                       |
| `screenshot` | `pnpm screenshot` | Launches a headless browser against a running dev server and captures a screenshot of every app page into `public/screenshots/`, used for the README. |

## Contributing

Contributions make the open-source community an amazing place to learn and create. Any contributions you make are greatly appreciated.

Before opening a pull request, see [CONTRIBUTING.md](CONTRIBUTING.md) for the local setup, commit message convention (Conventional Commits), and branching rules this project follows.

## License

Distributed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

## Author

Developed by **Dário Matias**:

- **Portfolio**: [dariomatias-dev.com](https://dariomatias-dev.com)
- **GitHub**: [dariomatias-dev](https://github.com/dariomatias-dev)
- **Email**: [dariomatias.dev@gmail.com](mailto:dariomatias.dev@gmail.com)
- **Instagram**: [@dariomatias_dev](https://instagram.com/dariomatias_dev)
- **LinkedIn**: [linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
