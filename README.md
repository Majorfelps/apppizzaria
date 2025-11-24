# 🍕 Sistema de Gestão de Pizzaria

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14.0.0-black.svg)

Sistema completo para gestão de pizzarias, incluindo backend RESTful API, dashboard administrativo e interface para clientes.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Visão Geral

O **Sistema de Gestão de Pizzaria** é uma aplicação full-stack desenvolvida para gerenciar todos os aspectos operacionais de uma pizzaria, desde o cadastro de produtos até o controle completo de pedidos.

### Componentes Principais:

- **Backend API**: API RESTful construída com Node.js e Express
- **Dashboard**: Interface administrativa para gestão (Next.js)
- **Customer**: Interface para clientes realizarem pedidos (Next.js)

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via JSON Web Tokens
- **Bcrypt** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **CORS** - Controle de acesso cross-origin

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP

### DevOps & Tools
- **ts-node-dev** - Desenvolvimento com hot reload
- **ESLint** - Linter para código padronizado
- **Supabase** - Armazenamento de imagens (opcional)

## 🏗️ Arquitetura

O projeto segue os princípios de **Domain-Driven Design (DDD)** e arquitetura em camadas:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Controllers, Routes, Middlewares)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│         (Services/Use Cases)            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Domain Layer                   │
│      (Business Logic, Entities)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │
│     (Prisma, Database, Storage)         │
└─────────────────────────────────────────┘
```

## ✨ Funcionalidades

### 🔐 Autenticação e Usuários
- [x] Cadastro de usuários
- [x] Login com JWT
- [x] Atualização de perfil
- [x] Listagem de usuários
- [x] Exclusão de usuários
- [x] Middleware de autenticação

### 📦 Categorias
- [x] Criação de categorias
- [x] Listagem de categorias (pública)
- [x] Atualização de categorias

### 🍕 Produtos
- [x] Cadastro de produtos com imagem
- [x] Listagem de produtos por categoria
- [x] Listagem de todos os produtos (pública)
- [x] Atualização de produtos
- [x] Upload de imagens de produtos

### 📋 Pedidos
- [x] Criação de pedidos
- [x] Adição de itens ao pedido
- [x] Remoção de itens do pedido
- [x] Envio de pedido para produção
- [x] Listagem de pedidos
- [x] Detalhes do pedido
- [x] Finalização de pedidos
- [x] Remoção de pedidos (draft)

### 📊 Dashboard
- [x] Interface de login/cadastro
- [x] Listagem de pedidos com filtros
- [x] Atualização de status de pedidos
- [x] Visualização de detalhes

### 👥 Customer App
- [x] Interface de login
- [x] Visualização de produtos
- [x] Realização de pedidos

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm ou yarn

### Clone o repositório

```bash
git clone https://github.com/Majorfelps/apppizzaria.git
cd apppizzaria
```

### Instale as dependências

#### Backend
```bash
npm install
```

#### Frontend Dashboard
```bash
cd frontPizzaria/dashboard
npm install
```

#### Frontend Customer
```bash
cd frontPizzaria/customer
npm install
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pizzaria?schema=public"

# JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Supabase (opcional - para upload de imagens)
SUPABASE_URL="sua_url_supabase"
SUPABASE_KEY="sua_chave_supabase"

# Server
PORT=3333
```

### Configuração do Banco de Dados

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Para visualizar os dados no Prisma Studio:

```bash
npx prisma studio
```

## 🎮 Uso

### Iniciar o Backend

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

### Iniciar o Dashboard

```bash
cd frontPizzaria/dashboard
npm run dev
```

Dashboard disponível em `http://localhost:3000`

### Iniciar o Customer App

```bash
cd frontPizzaria/customer
npm run dev
```

Customer app disponível em `http://localhost:3001`

## 📡 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/users` | Criar novo usuário | ❌ |
| POST | `/session` | Login | ❌ |
| GET | `/me` | Obter dados do usuário autenticado | ✅ |

### Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/users` | Listar usuários | ✅ |
| PUT | `/user` | Atualizar usuário | ✅ |
| DELETE | `/user` | Deletar usuário | ✅ |

### Categorias

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/category` | Criar categoria | ✅ |
| GET | `/category` | Listar categorias | ❌ |
| PUT | `/category` | Atualizar categoria | ✅ |

### Produtos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/product` | Criar produto (com upload) | ✅ |
| GET | `/products` | Listar todos os produtos | ❌ |
| GET | `/category/product` | Listar produtos por categoria | ✅ |
| PUT | `/product` | Atualizar produto | ✅ |

### Pedidos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/order` | Criar pedido | ✅ |
| DELETE | `/order` | Remover pedido | ✅ |
| GET | `/orders` | Listar pedidos | ✅ |
| GET | `/order/detail` | Detalhes do pedido | ✅ |
| PUT | `/order/send` | Enviar pedido | ✅ |
| PUT | `/order/finish` | Finalizar pedido | ✅ |

### Itens do Pedido

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/order/add` | Adicionar item ao pedido | ✅ |
| DELETE | `/order/remove` | Remover item do pedido | ✅ |

### Arquivos Estáticos

| Endpoint | Descrição |
|----------|-----------|
| `/files/*` | Acesso às imagens de produtos |

## 📁 Estrutura do Projeto

```
apppizzaria/
├── prisma/                      # Schema e migrations do Prisma
│   ├── schema.prisma           # Definição do banco de dados
│   └── migrations/             # Histórico de migrations
│
├── src/                        # Código fonte do backend
│   ├── @types/                 # Definições de tipos TypeScript
│   ├── config/                 # Configurações (multer, etc)
│   ├── controllers/            # Controllers (Presentation Layer)
│   │   ├── user/
│   │   ├── category/
│   │   ├── products/
│   │   └── order/
│   ├── services/               # Services (Application Layer)
│   │   ├── user/
│   │   ├── category/
│   │   ├── products/
│   │   └── order/
│   ├── middlewares/            # Middlewares (autenticação, etc)
│   ├── prisma/                 # Cliente Prisma
│   ├── routes.ts               # Definição de rotas
│   └── server.ts               # Entrada da aplicação
│
├── frontPizzaria/              # Aplicações frontend
│   ├── dashboard/              # Dashboard administrativo
│   │   └── src/
│   │       ├── modules/        # Módulos DDD
│   │       ├── pages/          # Pages do Next.js
│   │       └── shared/         # Componentes compartilhados
│   │
│   └── customer/               # Aplicação do cliente
│       └── src/
│           ├── modules/        # Módulos DDD
│           ├── pages/          # Pages do Next.js
│           └── shared/         # Componentes compartilhados
│
└── tmp/                        # Arquivos temporários (uploads)
```

## 🗃️ Modelo de Dados

### User (Usuários)
```prisma
- id: String (UUID)
- name: String
- email: String
- password: String (hash)
- created_at: DateTime
- updated_at: DateTime
```

### Category (Categorias)
```prisma
- id: String (UUID)
- name: String
- products: Product[]
- created_at: DateTime
- updated_at: DateTime
```

### Product (Produtos)
```prisma
- id: String (UUID)
- name: String
- price: String
- description: String
- banner: String (URL da imagem)
- category_id: String (FK)
- category: Category
- items: Item[]
- created_at: DateTime
- updated_at: DateTime
```

### Order (Pedidos)
```prisma
- id: String (UUID)
- table: Int
- status: Boolean (false = em produção, true = finalizado)
- draft: Boolean (true = rascunho, false = enviado)
- name: String? (nome do cliente)
- items: Item[]
- created_at: DateTime
- updated_at: DateTime
```

### Item (Itens do Pedido)
```prisma
- id: String (UUID)
- amount: Int
- order_id: String (FK)
- product_id: String (FK)
- order: Order
- product: Product
- created_at: DateTime
- updated_at: DateTime
```

## 🧪 Testes

Para executar os testes manuais, consulte:
- `GUIA_TESTES_MANUAIS.md`
- `TESTES_REALIZADOS.md`
- `README_TESTES.md`

## 🔒 Segurança

- Senhas criptografadas com bcryptjs
- Autenticação via JWT
- Middleware de autenticação protegendo rotas sensíveis
- Validação de dados de entrada
- CORS configurado

## 🚧 Próximos Passos

Consulte o arquivo `PROXIMOS_PASSOS.md` para ver as próximas funcionalidades planejadas.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Majorfelps**

- GitHub: [@Majorfelps](https://github.com/Majorfelps)
- Projeto: [apppizzaria](https://github.com/Majorfelps/apppizzaria)

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do perfil.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

Desenvolvido com ❤️ e ☕
