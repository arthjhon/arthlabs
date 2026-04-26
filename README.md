# arThLabs Site

Vitrine pessoal de Arthur — experimentos, projetos e blog técnico.

**Stack:** Astro + MDX · Cloudflare Pages · GitHub Actions

## Dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # gera ./dist
npm run preview
```

## Estrutura

```
src/
├── pages/            Rotas
├── layouts/          Layout base
├── components/       Componentes reutilizáveis
├── content/
│   ├── projects/     MDX — um arquivo por projeto
│   └── blog/         MDX — um arquivo por post
├── styles/           CSS global
└── content.config.ts Schema dos content collections
```

## Publicar conteúdo

Criar `src/content/projects/<slug>.mdx` ou `src/content/blog/<slug>.mdx` seguindo o frontmatter dos exemplos. O site é regenerado a cada push na main.

## Deploy

- Repo → GitHub Actions → build → Cloudflare Pages
- PRs geram preview URL automática
- Secrets necessários: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
