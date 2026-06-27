# Meu Devocional 365

**Propósitos, Orações e Respostas**

Meu Devocional 365 é um aplicativo web mobile-first para criar e acompanhar propósitos espirituais, registrar orações diárias, versículos, louvores, respostas recebidas e histórico de caminhada.

Esta versão usa login com e-mail e senha pelo Supabase. Cada usuário acessa somente os próprios propósitos e registros.

## Tecnologias

- React
- Vite
- Supabase Auth
- Supabase Database com Row Level Security
- Netlify

## Como instalar

```bash
npm install
```

## Como rodar localmente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publicavel_do_supabase
```

Depois rode:

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

## Supabase

Execute o arquivo `supabase.sql` no SQL Editor do Supabase antes de usar o app em produção.

Esse SQL cria as tabelas:

- `devocional_purposes`
- `devocional_records`

Também ativa Row Level Security e cria policies para `select`, `insert`, `update` e `delete`, garantindo que `auth.uid() = user_id`.

Não use chave secreta, `service_role` ou secret key no frontend. O app usa somente a chave publicável/anônima do Supabase.

## Publicação na Netlify

O projeto inclui `netlify.toml`:

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

Em **Site configuration > Environment variables** na Netlify, cadastre:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Depois faça um novo deploy.

## Migração de dados locais

Versões antigas salvavam os dados no `localStorage` do navegador. Esta versão não apaga esses dados automaticamente.

Se houver dados locais, o app mostra uma opção para migrar os propósitos para a conta logada no Supabase.
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
