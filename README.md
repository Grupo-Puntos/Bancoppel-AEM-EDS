# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--bancoppel-aem-eds--grupo-puntos.aem.page/
- Live: https://main--bancoppel-aem-eds--grupo-puntos.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
pnpm i
```

## Linting

```sh
pnpm lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `pnpm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Skills
```bash
# GitHub CLI
$ gh extension install ai-ecoverse/gh-upskill
$ gh upskill adobe/skills --skills-path plugins/aem/edge-delivery-services --all

# Claude Code
/plugin marketplace add adobe/skills
/plugin install aem-edge-delivery-services@adobe-skills
```

---

## Model Context Protocol (MCP) Recomendados

Configura los siguientes servidores MCP para ampliar tus capacidades en proyectos EDS:

1.  **Context7 MCP Server:** Te proporciona acceso directo a la documentación de API indexada de AEM (accesible en `https://context7.com/llmstxt/aem_live_llms_txt`).
2.  **Helix MCP Server:** Un MCP no oficial que ofrece herramientas para iniciar bloques, buscar documentación y ejecutar llamadas administrativas.
3.  **DA MCP Server:** Facilita la creación y manipulación de contenido directamente si el proyecto utiliza Document Authoring (DA).
4.  **Browser MCP:** Extensión que te permite controlar un navegador Chrome de manera remota para tomar capturas de pantalla de `localhost:3000` y evaluar visualmente el diseño.

---