# CodeEditor

Editor de código TypeScript/JavaScript en el navegador con consola de salida en tiempo real. Construido con [Angular](https://angular.dev/) y [Monaco Editor](https://microsoft.github.io/monaco-editor/) (el mismo motor de VS Code).

## Características

- **Monaco Editor** — Editor completo con resaltado de sintaxis TypeScript, autocompletado, minimap y soporte para bracket colorization.
- **Ejecución en tiempo real** — El código se transpila de TypeScript a JavaScript y se ejecuta en un Web Worker de forma automática con debounce de 1 segundo.
- **Consola completa** — Captura y muestra `console.log`, `console.warn`, `console.error`, `console.info`, `console.debug`, `console.table`, `console.time`/`console.timeEnd`, `console.assert`, `console.count` y más, cada uno con estilo visual diferenciado.
- **5 temas personalizados** — 2 claros (Standard, Cloud) y 3 oscuros (Retro Console, Neon Blue, Obsidian), con persistencia en `localStorage`.
- **Layout responsive** — En desktop editor y consola se muestran lado a lado; en móvil se apilan verticalmente.
- **Clear console** — Botón para limpiar la salida de la consola.

## Tecnologías

| Paquete | Uso |
|---|---|
| Angular 21 | Framework principal |
| Monaco Editor | Motor del editor de código |
| ngx-monaco-editor-v2 | Wrapper Angular para Monaco |
| TypeScript | Lenguaje del editor y transpilación en runtime |
| Web Workers | Ejecución sandboxed del código |
| Bootstrap | Estilos base |
| FontAwesome | Iconos |

## Inicio rápido

### Requisitos

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Instalación

```bash
pnpm install
```

### Servidor de desarrollo

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar archivos fuente.

### Build de producción

```bash
ng build --configuration production
```

Los artefactos se generan en `dist/code-editor/browser`.

### Tests unitarios

```bash
ng test
```

Ejecuta los tests unitarios via [Karma](https://karma-runner.github.io).

### Tests end-to-end

```bash
ng e2e
```

Requiere agregar un paquete que implemente capabilities de testing e2e.

## Estructura del proyecto

```
src/app/
├── shared/
│   ├── editor/              # Wrapper del Monaco Editor (ControlValueAccessor)
│   ├── console-view/        # Visor de salida de consola
│   │   └── code-executor.worker.ts  # Web Worker para ejecución sandboxed
│   ├── models/              # Interfaces TypeScript (ConsoleEntry, ConsoleMethod, etc.)
│   └── services/
│       ├── theme.service.ts           # Gestión de temas y persistencia
│       └── console-serializer.service.ts  # Serialización de argumentos de consola
├── app.component.*          # Componente raíz (layout toolbar + split panel)
└── app.module.ts            # Módulo raíz
```

## Deploy en GitHub Pages

### Requisitos

- [Node.js](https://nodejs.org/) instalado
- [pnpm](https://pnpm.io/) instalado
- Dependencias instaladas:
  ```
  pnpm install
  ```
- La rama `gh-pages` debe existir en el repositorio remoto. Si no existe, créala primero:
  ```
  git checkout --orphan gh-pages
  git rm -rf .
  git commit --allow-empty -m "Init gh-pages"
  git push origin gh-pages
  git checkout main
  ```

### Configuración del proyecto

Angular necesita usar un `base-href` apuntando al nombre del repositorio para que los recursos se carguen correctamente en la subruta de GitHub Pages.

Ejemplo:

```
ng build --configuration production --base-href="/code-editor/"
```

### Build de producción

Para generar el compilado de producción:

```
ng build --configuration production --base-href="/code-editor/"
```

Angular puede generar la salida en una de las siguientes rutas dependiendo de la versión:

- `dist/code-editor`
- `dist/code-editor/browser`

### Deploy

Ejecuta el script de deploy incluido en el proyecto:

```
pnpm run deploy
```

Este script ejecuta el build de producción y publica los archivos en la rama `gh-pages` del repositorio usando git directamente.

### URL final

El proyecto estará disponible en:

```
https://<usuario>.github.io/code-editor/
```

### Nota importante

Este repositorio **NO** debe usar `base-href="/"`, ya que esa configuración está reservada para el repositorio principal `<usuario>.github.io`.

## Licencia

MIT — Jesus Requena (2024)
