<p align="center">
  <strong>Idioma:</strong> <a href="architecture.md">English</a> | <a href="architecture.pt-BR.md">Português (BR)</a> | Español
</p>

# Arquitectura

Este documento describe el sistema tal como es hoy. Todo lo que aún no
está implementado pertenece a un issue, no aquí.

## Árbol de directorios

```
app/                  Rutas (Next.js App Router). Páginas, layouts,
                       route handlers de API, sitemap.ts, robots.ts.
  api/                 Route handlers - el único lugar autorizado a leer
                       secretos (GITHUB_TOKEN, GEMINI_API_KEY) o escribir
                       en lib/api/*.
  package/[...importPath]/  La página de detalle del paquete. Es un
                       segmento catch-all porque el import path de Go
                       contiene barras (ej: golang.org/x/net).

components/            Componentes React, agrupados por la página/feature
                       dueña (home/, search/, compare/, package/,
                       favorites/, popular/) más grupos compartidos:
  common/              UI genérica reutilizada entre features
                       (Pagination, SearchHistoryDropdown) que no es una
                       primitiva de diseño pura.
  layout/              Header, Footer, nav-links - el armazón de la
                       página.
  providers/           Providers de cliente globales de la app (tema,
                       restauración de scroll).
  ui/                  Primitivas de diseño (button, select, tooltip,
                       dropdown-menu) - en su mayoría generadas por
                       shadcn, lo bastante genéricas para no saber nada
                       de paquetes Go.

hooks/                 Hooks de React del lado del cliente (useFavorites,
                       usePackageDetail) - estado y acceso a APIs del
                       navegador que un Server Component no puede hacer
                       directamente.

lib/                   Lógica agnóstica de framework: sin JSX, sin hooks
                       de React.
  api/                 Soporte para route handlers: esquemas zod, el
                       envoltorio de respuesta { error: { code, message } },
                       el rate limiter en memoria.
  github/               Cliente REST de GitHub + Go Module Proxy,
                       normalización de respuestas, la tabla de
                       mapeo de vanity imports, resilientFetch (timeout +
                       retry).

types/                  Tipos de TypeScript compartidos, sin código en
                       tiempo de ejecución.
```

## Regla de capas

```
app/  →  components/  →  hooks/  →  lib/  →  types/
```

Una flecha significa "puede importar de". La regla solo corre en una
dirección:

- `lib/` nunca importa de `components/`, `hooks/` ni `app/` - no tiene
  JSX ni React, así que se puede probar con Vitest puro, sin DOM (ver
  `lib/**/*.test.ts`).
- `hooks/` puede usar `lib/` y APIs del navegador, pero no está atado a
  una página específica - `useFavorites` se comparte entre la página de
  inicio, la tarjeta de paquete y el encabezado del detalle del
  paquete.
- `components/` puede usar `hooks/` y `lib/`, nunca al revés.
- `app/` compone `components/` en rutas y es dueña de la obtención de
  datos de los Server Components; es la única capa autorizada a llamar
  `getPackageDetail` o un esquema de `lib/api/*` directamente fuera de
  un route handler.

`types/` queda fuera de esa cadena de flechas: cualquier capa puede
importar un tipo, y los tipos nunca importan de nada más que otros
tipos.

## Frontera Server / Client Component

El `page.tsx` de cada ruta es un Server Component por defecto. Obtiene
los datos (vía `lib/github` o `lib/github/cached`) y renderiza. En el
momento en que un componente necesita `useState`, `useEffect`,
`onClick` o una API del navegador (`localStorage`, `window`), se marca
`"use client"` y se empuja lo más abajo posible en el árbol - la propia
página de búsqueda sigue siendo un Server Component; `SearchSection`
(dueña del estado de paginación y del fetch con debounce a
`/api/search`) es la frontera de cliente.

La página de detalle del paquete
(`app/package/[...importPath]/page.tsx`) es una excepción parcial:
obtiene los datos del paquete en el servidor dos veces, para dos
propósitos distintos - una para `generateMetadata` (título/etiquetas
OG) y otra para la etiqueta `<script>` de JSON-LD renderizada en el
cuerpo de la página - mientras que la UI interactiva real
(`PackageDetail`) es un client component que vuelve a pedir
`/api/package-info` de forma independiente al montarse. Ambas
obtenciones del lado del servidor pasan por el mismo envoltorio
`getCachedPackageDetail` (`lib/github/cached.ts`) precisamente para
compartir una sola entrada de caché en vez de pagar el costo del fetch
a GitHub/Go-proxy/README dos veces.

## Estrategia de caché

Tres capas, cada una resolviendo un problema distinto:

1. **`"use cache"` + `cacheLife`** (Next.js Cache Components) - se usa
   dentro de los route handlers de API y de la página de detalle del
   paquete para cachear el _resultado del fetch costoso en sí_ (GitHub
   API + Go Proxy + scraping de README puede significar una decena de
   solicitudes salientes para un solo paquete). Cada función cacheada
   define su propio `cacheLife({ revalidate: <segundos> })`: 30 min
   para detalles de paquete, 1 hora para búsqueda/versiones/releases/
   populares, 1 día para el resumen de IA y la nota de Go Report Card
   (cambian raramente y cuestan cuota real de API para regenerarse).
2. **Cabeceras HTTP `Cache-Control`** en la respuesta del route
   handler - permite que navegadores, CDNs y el `fetch()` del cliente
   se salten por completo la ida a la red con caché caliente,
   independientemente de la caché del servidor de arriba. El
   `s-maxage` coincide con el valor de `cacheLife` de la ruta.
3. **`localStorage`**, para estado que es genuinamente por navegador y
   no tiene representación en el servidor: favoritos (`useFavorites`),
   historial de paquetes visitados e historial de búsqueda. No existe
   sistema de cuentas ni base de datos - favoritos e historial quedan
   deliberadamente acotados a un solo navegador, no es una carencia del
   producto a llenar después.

## Mapeo de vanity imports

`lib/github/client.ts` mapea una lista fija de vanity import paths de
Go (`go.uber.org/zap`, `golang.org/x/net`, `gopkg.in/yaml.v3`, …) a su
`owner/repo` real en GitHub. Es una **tabla estática**, no una
resolución dinámica (siguiendo la meta tag `go-import` del vanity
import o el redirect `?go-get=1`), por dos razones:

- **Determinismo bajo una CSP estricta.** Resolver un vanity import
  dinámicamente implica obtener una página HTML arbitraria de terceros
  y parsear una meta tag antes de que la solicitud real siquiera
  empiece - un salto de red extra con sus propios modos de falla,
  presupuesto de timeout y (si se raspa sin cuidado) superficie de
  inyección.
- **Es una lista corta y conocida.** El ecosistema de Go tiene un
  número pequeño de dominios de vanity import populares. Cuando aparece
  uno nuevo con la frecuencia suficiente para importar, es una línea
  más en la tabla, no un mecanismo de resolución nuevo.

Un import path que no está en la tabla y todavía no es
`github.com/...` se asume directamente como `github.com/<path>`
(`parseGithubRepo`). Esa suposición vale para la gran mayoría de los
paquetes Go y falla silenciosamente (devuelve `null`, quien la llama
degrada con gracia) para el resto.

## Límite de tasa (rate limiting)

`lib/api/rate-limit.ts` implementa un contador de ventana fija, en
memoria (10 solicitudes/minuto por IP de cliente), aplicado en
`package-summary` y `package-assistant` - las dos rutas que gastan
cuota de la API de Gemini en cada solicitud.

**Limitación conocida:** el contador vive en la memoria del proceso de
Node. En una plataforma serverless que corre varias instancias
concurrentes (lo que hace Vercel bajo carga), cada instancia aplica el
límite de forma independiente, así que el límite _efectivo_ es
`10 × número de instancias`, no un tope global rígido de 10. Esto es
aceptable en la escala actual del proyecto - evita el abuso trivial de
un solo cliente, que era el problema real - pero no es un rate limiter
distribuido. Una solución de verdad movería el contador a un
almacenamiento compartido (Redis, Vercel KV), y queda fuera de alcance
hasta que el consumo de cuota sea realmente un problema en producción.

## Cliente HTTP resiliente

`resilientFetch` (`lib/github/client.ts`) envuelve cada llamada externa
a GitHub, al Go Module Proxy, a `raw.githubusercontent.com` y a
goreportcard.com con:

- Un timeout de solicitud (`AbortSignal.timeout`), para que una
  respuesta lenta del upstream no mantenga una ruta abierta hasta que
  el propio timeout de la plataforma la mate.
- Reintento con backoff exponencial, pero **solo** para respuestas 5xx
  y errores de red - un 4xx nunca se reintenta, ya que reintentar un
  error de cliente solo repite la misma falla.
- Respeto a la cabecera `Retry-After` en 403/429 (respuestas de límite
  de tasa de GitHub), limitado a 10 segundos para que una ruta nunca
  quede colgada esperando un enfriamiento arbitrariamente largo del
  upstream.

El bucle de rastreo de README en `getPackageDetail` (que prueba hasta 5
ramas × 5 nombres de archivo) lo llama con `retries: 0` a propósito -
con hasta 25 intentos ya de por sí, agregar reintentos encima
multiplicaría un peor caso que ya es costoso.
