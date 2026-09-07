<p align="center">
  <strong>Idioma:</strong> <a href="dependencies.md">English</a> | <a href="dependencies.pt-BR.md">Português (BR)</a> | Español
</p>

# Dependencias fijadas

La mayoría de las dependencias en `package.json` usan un rango con `^`
y se actualizan libremente vía Renovate. Las entradas de abajo están
fijadas a una versión exacta (sin `^`) a propósito. Cada una responde:
qué es, por qué está fijada, qué se rompe si se quita la fijación, y qué
la quita.

## `next` - `16.2.6`

**Qué es:** el framework en sí.

**Por qué está fijada:** este proyecto corre una versión muy reciente
de Next.js con Cache Components (`cacheComponents: true`, `"use cache"`

- `cacheLife`) y sigue al framework de cerca, tan de cerca que ya
  chocó con un cambio de nombre disruptivo a mitad del desarrollo: la
  convención de archivo `middleware.ts` fue renombrada a `proxy.ts` en
  una release puntual, descubierta solo al leer
  `node_modules/next/dist/docs/` directamente, porque el cambio todavía
  no se había propagado a la documentación pública indexada en el
  entrenamiento de los asistentes de código con IA (ver `AGENTS.md`). Un
  rango con `^` en un framework que se mueve a esta velocidad arriesga
  traer otro cambio de nombre así, un cambio en la semántica de Cache
  Components, o una alteración en el comportamiento del App Router sin
  una revisión deliberada del changelog antes.

**Qué se rompe si se destraba:** nada hoy - pero la próxima release de
`next` podría cambiar la semántica de caché de Cache Components,
renombrar otra convención de archivo, o alterar cómo interactúan
`generateMetadata`/`opengraph-image.tsx` con una ruta catch-all (ver la
nota en [architecture.md](architecture.md) sobre por qué las imágenes
OG dinámicas por paquete no son posibles). Cualquiera de esas
aparecería como una falla de build o un cambio silencioso de
comportamiento, no como un error de tipo.

**Qué quita la fijación:** una actualización deliberada - leer las
notas de la release (y volver a revisar
`node_modules/next/dist/docs/` por cualquier cosa aún no publicada en
el sitio público) de cada versión menor entre la fijación actual y el
objetivo, subir `next` y `eslint-config-next` juntos, correr
`./scripts/verify.sh`, y actualizar esta entrada con el nuevo
razonamiento.

## `eslint-config-next` - `16.2.6`

**Qué es:** las reglas de ESLint publicadas por el equipo de Next.js
para proyectos App Router.

**Por qué está fijada:** debe coincidir exactamente con la versión de
`next` - la config que exporta se genera contra una release específica
del framework y no tiene garantía de compatibilidad entre versiones.

**Qué se rompe si se destraba:** reglas de lint que referencian APIs de
Next.js eliminadas o renombradas, o faltan reglas para las nuevas -
inconsistente, no es una falla dura, pero vale la pena evitarlo.

**Qué quita la fijación:** siempre se sube en el mismo commit que
`next`, nunca de forma independiente.

## `react` / `react-dom` - `19.2.4`

**Qué es:** el runtime de UI.

**Por qué está fijada:** los Cache Components y el Partial Prerendering
de Next 16.2.6 dependen de internals específicos de React (los que
permiten que una página tenga un shell estático con una región
transmitida dinámicamente). El propio Next fija un rango estrecho y
compatible de React exactamente por eso, y este proyecto refleja esa
fijación en vez de dejar que Renovate mueva React de forma
independiente de Next, lo que podría combinar una versión de React
contra la que Next 16.2.6 no fue construido.

**Qué se rompe si se destraba:** posiblemente nada en un bump de
parche, pero no hay garantía - los internals de React usados por Cache
Components no forman parte del contrato público de estabilidad de
React de la misma manera que las APIs de componentes.

**Qué quita la fijación:** se sube junto con `next`, después de revisar
el `package.json` de la versión objetivo de Next para ver el rango de
React contra el que fue construido y probado.

## Configuración de Renovate

Una vez que Renovate esté configurado (`renovate.json`), debe
deshabilitar las actualizaciones para estos cuatro paquetes
explícitamente, con la `description` de cada regla apuntando de vuelta
a este archivo. Hasta entonces, un PR de Renovate que proponga subir
uno de ellos individualmente es una señal de que este documento está
desactualizado - concilia los dos en vez de aceptar el PR a ciegas.
