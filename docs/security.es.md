<p align="center">
  <strong>Idioma:</strong> <a href="security.md">English</a> | <a href="security.pt-BR.md">Português (BR)</a> | Español
</p>

# Política de Seguridad

## Versiones soportadas

Este proyecto no tiene ramas de versión propiamente dichas - `main` es
la única versión soportada, y una corrección se publica como un commit
nuevo ahí, no se retroporta a ningún otro lado.

## Alcance

Antes de reportar, ten en cuenta qué es realmente esta app: un catálogo
público y de solo lectura de metadatos de paquetes Go. **No existe
sistema de cuentas, estado de usuario en el servidor, ni base de
datos** - los favoritos y el historial de búsqueda viven enteramente en
el navegador de quien visita (`localStorage`), nunca se envían al
servidor. Eso descarta una categoría de reportes (fijación de sesión,
toma de cuenta, XSS almacenado vía perfil de usuario, IDOR sobre datos
de usuario) que no aplican porque la superficie a la que apuntarían no
existe aquí. Ver [architecture.md](architecture.md) para el panorama
completo.

Lo que **sí** está en alcance: la app web pública y sus rutas de API
(`app/api/**`), incluyendo la validación de entrada, la integración con
las APIs de GitHub/Gemini, la Content-Security-Policy y otras cabeceras
de seguridad (`next.config.ts`), y la cadena de dependencias
(`pnpm-lock.yaml`, escaneada automáticamente por `osv-scanner` en CI -
ver [contributing.md](contributing.md)).

## Reportar una vulnerabilidad

Por favor **no** abras un issue público en GitHub para un reporte de
seguridad.

Preferido: usa los
[Security Advisories](https://github.com/dariomatias-dev/go-pkg/security/advisories/new)
privados de GitHub para este repositorio.

Alternativa: escribe a **dariomatias.dev@gmail.com** con una
descripción del problema.

Incluye, si puedes:

- La ruta o componente afectado.
- Pasos para reproducirlo, o una prueba de concepto mínima.
- El impacto tal como lo ves - qué podría hacer realmente un atacante
  con esto.

## Qué esperar

Este es un proyecto de un solo mantenedor, a escala de portafolio. No
hay un SLA formal, y prometer uno sería deshonesto. En la práctica: un
reporte con una reproducción clara se reconoce y se revisa con
prontitud, pero "con prontitud" aquí significa "cuando el mantenedor
esté disponible", no una ventana de respuesta contractual. Si el
proyecto alguna vez crece a un equipo, esta sección es lo primero que
debería cambiar.
