# GoLedger TV — Desafio Front-end

Interface web estilo catálogo IMDB para **séries de TV**, **temporadas**, **episódios** e **watchlists**, com CRUD integrado à API REST da GoLedger (dados persistidos em ledger).

---

## Como executar o projeto

### Pré-requisitos

- **Node.js** 20 ou superior (recomendado; compatível com Next.js 16)
- **npm** 9 ou superior
- Credenciais de **Basic Auth** da API GoLedger

### 1. Clonar o repositório e usar a branch correta

Este projeto deve ser executado na branch **`viniciusrbr-branch`**.

```bash
git clone <url-do-seu-repositorio>
cd goledger-challenge-web
git checkout viniciusrbr-branch
```

Se você já clonou antes:

```bash
git fetch origin
git checkout viniciusrbr-branch
git pull origin viniciusrbr-branch
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Na raiz do projeto, crie um arquivo **`.env`** (ou **`.env.local`**) copiando o modelo:

```bash
cp .env.example .env
```

Edite o `.env` e preencha com suas credenciais reais:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API GoLedger (ex.: `http://ec2-50-19-36-138.compute-1.amazonaws.com`) |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação Next em execução (em desenvolvimento: `http://localhost:3000`) — necessária para chamadas à API a partir do **servidor** (SSR, Server Actions). |
| `NEXT_PUBLIC_API_USER` | Usuário Basic Auth |
| `NEXT_PUBLIC_API_PASS` | Senha Basic Auth |

> **Importante:** sem `NEXT_PUBLIC_APP_URL` apontando para onde o `npm run dev` está rodando, contagens na home e outras requisições feitas no servidor podem falhar.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 5. Build de produção (opcional)

```bash
npm run build
npm start
```

---

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Gera build de produção |
| `npm start` | Sobe o servidor após o `build` |
| `npm run lint` | Biome: lint e formatação (`--write`) |
| `npm run format` | Biome: apenas formatar |

---

## Stack principal

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **shadcn/ui** · **react-hook-form** · **Zod**
- Estrutura em camadas (domínio, aplicação, infraestrutura, UI)

---

## Contexto original do desafio

Fork do repositório oficial: [goledgerdev/goledger-challenge-web](https://github.com/goledgerdev/goledger-challenge-web).

Requisitos do desafio: CRUD completo para **tv shows**, **seasons**, **episodes** e **watchlists**; uso de **React** ou **Next.js**; UI clara e funcional.

Para concluir a entrega, envie o link do repositório (fork) com o código e **instruções para executar** — como as descritas acima.
