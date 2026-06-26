# Meu Devocional 365

**Propósitos, Orações e Respostas**

Meu Devocional 365 é um aplicativo web mobile-first para criar e acompanhar propósitos espirituais, registrar orações diárias, versículos, louvores, respostas recebidas e histórico de caminhada.

Os dados ficam salvos no próprio navegador por meio de `localStorage`. Esta versão não usa login, backend ou banco de dados externo.

## Tecnologias

- React
- Vite
- localStorage
- Netlify

## Como instalar

```bash
npm install
```

## Como rodar localmente

```bash
npm run dev
```

## Como gerar build

```bash
npm run build
```

O build de produção é gerado na pasta:

```bash
dist
```

## Publicação na Netlify

O projeto já inclui o arquivo `netlify.toml` com a configuração de build:

```toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

Site publicado:

https://meu-devocional-365.netlify.app

Para conectar este repositório à Netlify, use:

- Build command: `npm run build`
- Publish directory: `dist`

## Observação sobre dados

Como os registros são salvos no `localStorage`, cada navegador/dispositivo mantém seus próprios dados. Use a tela de Backup do app para exportar ou importar os dados em JSON.
