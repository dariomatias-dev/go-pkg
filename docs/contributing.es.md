<p align="center">
<a href="contributing.md">English</a> · <strong>Español</strong> · <a href="contributing.pt-BR.md">Português (BR)</a>
</p>

# Contribuir

## Configuración

```bash
git clone https://github.com/dariomatias-dev/go-pkg.git
cd go-pkg
pnpm install
cp .env.example .env   # completa al menos GEMINI_API_KEY
```

`pnpm install` ejecuta el script `prepare` de Husky, que activa tres
hooks en `.husky/`:

- `pre-commit` corre `lint-staged` (`.lintstagedrc.json`), corrigiendo y
  formateando solo los archivos que hiciste stage.
- `commit-msg` corre `commitlint` contra la
  [convención de commits](#convención-de-commits) de abajo.
- `pre-push` corre el gate local (sin el build) antes de un push que
  actualice `main`, ya que CI solo reporta ese push después del hecho.

Los tres son comodidades locales y todos aceptan `git push --no-verify` /
`git commit --no-verify` como escape; los que realmente protegen la rama
son los jobs `commit-lint` y `verify` en CI. Las versiones de Node y pnpm están fijadas vía `.nvmrc`,
`engines` y `packageManager` en `package.json` - úsalas (`nvm use`) en
vez de lo que sea que esté en el `PATH` por casualidad.

## Antes de abrir un PR

Corre el gate local - refleja el CI paso a paso, así que una corrida
verde aquí significa que el CI no tiene un motivo nuevo para fallar. El
hook `pre-push` lo corre por ti en un push a `main`, pero en una rama la
responsabilidad es tuya:

```bash
./scripts/verify.sh        # format, lint, typecheck, test:coverage, build
./scripts/verify.sh --fast # bucle más rápido mientras iteras (sin build)
```

Checklist:

- [ ] `./scripts/verify.sh` pasa.
- [ ] Lógica nueva en `lib/` o `hooks/` tiene un test (ver
      [architecture.md](architecture.md) para saber qué pertenece a cada
      capa).
- [ ] Un cambio de comportamiento en una ruta de API tiene un test
      actualizado o nuevo en `app/api/**/*.test.ts`.
- [ ] Un cambio de UI que afecta un flujo visible para el usuario tiene
      un smoke test E2E (`pnpm e2e`) o una actualización de uno existente.
- [ ] El asunto del commit y el título del PR siguen la
      [convención](#convención-de-commits) de abajo - el hook
      `commit-msg` revisa los commits localmente, y CI revisa el título
      del PR.

## Convención de commits

Los PRs se mergean por squash, y el commit de squash toma el título del PR
tal cual - así que es el título del PR, no el historial de la rama, lo que
release-please lee para elegir el bump de versión y escribir el CHANGELOG.
Los commits de la rama siguen la convención igual (el hook `commit-msg` los
revisa), pero el título del PR es lo que CI bloquea.

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org):

```
<tipo>(<alcance>): <asunto>
```

- **tipo**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `build`, `ci`, `revert`
- **alcance**: opcional, en minúsculas, ej: `search`, `compare`, `readme`
- **asunto**: modo imperativo, sin punto final, ≤72 caracteres

Ejemplos:

```
feat(compare): add dependency count column
fix(popular-package): handle GitHub API rate limit errors
docs(readme): document available npm scripts
```

El cuerpo (opcional) explica el _por qué_, no el _qué_ - el diff ya
muestra qué cambió.

## Ramas

- `main` está protegida: sin push directo, merge solo vía pull
  request.
- Nombres de rama: `<tipo>/<descripción-corta>` (ej: `feat/tag-filter`,
  `fix/search-pagination`).
- Checks obligatorios en `main`: `verify` y `e2e` (los jobs
  `vulnerabilities` y `lighthouse` informan pero no bloquean - ver la
  tabla de abajo).
- Merge solo squash o rebase - sin merge commits, para mantener el
  historial lineal y que cada entrada sea un Conventional Commit
  válido.
- En este repositorio (mantenedor único), el self-merge después de que
  el CI pase está permitido; la protección de rama igual exige el
  flujo de PR y los checks en verde.

## Qué revisa el CI

| Job               | Qué hace                                                                                                             | ¿Bloquea el merge?                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `verify`          | `format:check` → `lint` → `typecheck` → `test:coverage` → `build`, en ese orden (la comprobación más rápida primero) | Sí                                                                                    |
| `vulnerabilities` | `osv-scanner` contra `pnpm-lock.yaml`                                                                                | No - un aviso recién publicado sin corrección aún no debería bloquear cada PR         |
| `e2e`             | Smoke flows de Playwright en Chromium y WebKit, `needs: verify`                                                      | Sí                                                                                    |
| `lighthouse`      | Lighthouse CI contra la app compilada, solo informe                                                                  | No - todavía no se ha calibrado ningún presupuesto de rendimiento contra tráfico real |

## Reproducir el CI localmente con `act`

[`act`](https://github.com/nektos/act) corre el workflow de GitHub
Actions en un contenedor Docker local. `.actrc` ya está configurado con
una imagen de runner lo bastante cercana a la de GitHub para atrapar la
mayoría de las diferencias de entorno:

```bash
act pull_request -j verify
```

Es más lento que `./scripts/verify.sh` (primero construye una imagen de
contenedor) - úsalo cuando necesites depurar algo que solo falla en
CI, no como el bucle del día a día.

## Cómo triar un PR de Renovate

- Si toca uno de los paquetes fijados en
  [dependencies.md](dependencies.md), ciérralo y revisa si la regla
  `enabled: false` de `renovate.json` para ese paquete falta o está
  desactualizada - ese es el bug real, no el PR.
- En otro caso: revisa la propia descripción del PR (Renovate incluye
  el diff del changelog), corre `./scripts/verify.sh`, y haz merge si
  está en verde. Un PR agrupado (ej: `react` + `@types/react*` juntos)
  debe revisarse como una sola unidad - no separes commits de él.
- Un PR de bump de versión mayor recibe una revisión normal, no un
  sello automático: lee el changelog en busca de cambios disruptivos
  antes de hacer merge.

## Trabajar con un agente de IA

Este repositorio tiene `AGENTS.md` (y `CLAUDE.md`, que lo reexporta) en
la raíz, leído automáticamente por agentes de código que soportan la
convención. Actualmente indica que la versión fijada de Next.js
divergió de lo que está en los datos de entrenamiento de la mayoría de
los modelos, y señala `node_modules/next/dist/docs/` como fuente de
verdad para el comportamiento del framework - ese directorio viene con
el propio paquete `next` y está más actualizado que la documentación
pública indexada antes de esta fijación.

Si estás usando un agente para contribuir:

- Trata `node_modules/next/dist/docs/` como autoridad por encima del
  conocimiento de entrenamiento del agente para cualquier cosa
  específica de Next.js - convenciones de rutas de API, la convención
  de archivo `proxy.ts`, la semántica de `cacheLife`/Cache Components,
  y las reglas de archivos de metadata (ver la nota sobre rutas
  catch-all y `opengraph-image.tsx` en
  [architecture.md](architecture.md)).
- Una explicación plausible de un agente sobre _por qué_ algo está
  fijado o estructurado de cierta forma igual debe verificarse contra
  [dependencies.md](dependencies.md) y este archivo - prefiere
  actualizar la documentación antes que dejar que un razonamiento no
  documentado se desalinee del código.
- Corre `./scripts/verify.sh` tú mismo antes de confiar en la
  afirmación de un agente de que un cambio está en verde.

## Estilo de código

Sigue la config de ESLint del proyecto (`eslint.config.mjs`) y la
config de Prettier (`.prettierrc.json`) - ambas corren como parte de
`./scripts/verify.sh`, así que no hay una guía de estilo separada que
mantener sincronizada a mano.
