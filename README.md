# GoLedger TV — Desafio Front-end

Interface web estilo catálogo IMDB para **séries de TV**, **temporadas**, **episódios** e **watchlists**, com CRUD integrado à API REST da GoLedger (dados persistidos em ledger blockchain).

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Executando o projeto](#executando-o-projeto)
- [Scripts npm](#scripts-npm)
- [Arquitetura](#arquitetura)
- [Stack](#stack)

---

## Pré-requisitos

- **Node.js** 20 ou superior
- **npm** 9 ou superior
- Credenciais de **Basic Auth** da API GoLedger

---

## Instalação

**1. Clonar o repositório e entrar na branch correta**

```bash
git clone <url-do-repositorio>
cd goledger-challenge-web
git checkout viniciusrbr-branch
```

Se você já clonou antes:

```bash
git fetch origin
git checkout viniciusrbr-branch
git pull origin viniciusrbr-branch
```

**2. Instalar as dependências**

```bash
npm install
```

---

## Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API GoLedger (ex.: `http://ec2-50-19-36-138.compute-1.amazonaws.com`) |
| `NEXT_PUBLIC_APP_URL` | URL local da aplicação (desenvolvimento: `http://localhost:3000`) — usada pelo servidor para construir URLs absolutas em SSR e Server Actions |
| `API_USER` | Usuário Basic Auth — **nunca exposto no bundle do cliente** |
| `API_PASS` | Senha Basic Auth — **nunca exposta no bundle do cliente** |

> `API_USER` e `API_PASS` são lidas exclusivamente em Server Actions e Server Components. Sem o prefixo `NEXT_PUBLIC_`, o Next.js garante que elas não sejam enviadas ao navegador.

> Sem `NEXT_PUBLIC_APP_URL` apontando para onde o servidor está rodando, as contagens da home e outras requisições SSR irão falhar.

---

## Executando o projeto

**Desenvolvimento**

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

**Produção**

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
| `npm start` | Sobe o servidor após o build |
| `npm run lint` | Biome: lint e formatação (`--write`) |
| `npm run format` | Biome: apenas formatar |
| `npm test` | Roda os testes unitários com Jest |

---

## Arquitetura

O projeto segue uma **arquitetura em camadas** inspirada nos princípios de Clean Architecture. Cada camada tem responsabilidade única e depende apenas das camadas internas a ela.

```
src/
├── app/                        # Camada de apresentação (Next.js App Router)
│   ├── actions/                # Server Actions — ponte entre UI e casos de uso
│   ├── episodes/               # Rota: page.tsx (Server) + episodes-client.tsx (Client)
│   ├── seasons/
│   ├── tv-shows/
│   └── watchlist/
│
├── components/                 # Componentes de UI reutilizáveis
│   ├── ui/                     # Primitivos shadcn/ui (Button, Input, Table…)
│   ├── episodes-table/         # Tabela TanStack específica de episódios
│   ├── seasons-table/
│   ├── tv-shows-table/
│   └── watchlist-table/
│
├── core/                       # Núcleo da aplicação — independente de framework
│   ├── domain/                 # Entidades, tipos e interfaces de repositório
│   │   ├── episodes/           # Episode entity + EpisodeRepository interface
│   │   ├── seasons/
│   │   ├── tv-shows/
│   │   └── watchlist/
│   └── application/            # Casos de uso + DTOs com validação Zod
│       ├── episodes/           # CreateEpisodeUseCase, UpdateEpisodeUseCase…
│       ├── seasons/
│       ├── tv-shows/
│       └── watchlist/
│
├── infra/                      # Camada de infraestrutura — implementações externas
│   └── repositories/           # ApiEpisodeRepository, ApiTVShowRepository…
│
└── lib/                        # Utilitários transversais (api-client, date helpers)
```

### Fluxo de uma operação

```
UI (Client Component)
  → Server Action          (app/actions/*.actions.ts)
    → Use Case             (core/application/*/*.use-case.ts)
      → Repository (interface) (core/domain/*/*.repository.ts)
        → Repository (impl)    (infra/repositories/*.repository.ts)
          → GoLedger API
```

### Por que essa separação importa

| Benefício | Como se aplica aqui |
|-----------|---------------------|
| **Testabilidade** | Use cases e Server Actions são testados com mocks dos repositórios — sem depender da API real |
| **Segurança** | Credenciais e chamadas HTTP ficam apenas na infra e no servidor; o cliente nunca acessa a API diretamente |
| **Manutenibilidade** | Trocar a API (ou adicionar cache) exige mudar apenas `infra/repositories` — UI e regras de negócio não mudam |
| **Clareza** | Cada arquivo tem uma responsabilidade clara; um desenvolvedor novo sabe exatamente onde procurar |

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **shadcn/ui** · **Lucide Icons**
- **react-hook-form** · **Zod** · **@tanstack/react-table**
- **date-fns** · **Jest** (testes unitários) · **Biome** (lint + format)

---

## Contexto original do desafio

Fork do repositório oficial: [goledgerdev/goledger-challenge-web](https://github.com/goledgerdev/goledger-challenge-web).
