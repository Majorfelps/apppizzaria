# 🚀 Frontend Implementado com Next.js + DDD

## ✅ O que foi criado

### 1. **Setup Inicial** ✓
- ✅ `package.json` para Dashboard e Customer
- ✅ `tsconfig.json` com path aliases (`@/*`, `@/modules/*`, `@/shared/*`)
- ✅ `next.config.ts` com variáveis de ambiente
- ✅ `.env.example` para referência

### 2. **Camada de Infraestrutura Compartilhada** ✓
- ✅ **ApiClient.ts** - Cliente HTTP com interceptadores
  - Adiciona automaticamente token JWT nas requisições
  - Redireciona para login em caso de 401
  - Timeout de 10 segundos
- ✅ **TokenStorage.ts** - Gerenciamento de LocalStorage
  - Salva/recupera tokens e dados do usuário
  - SSR safe (verifica `typeof window`)

### 3. **Repositórios Implementados** ✓

#### Dashboard
- ✅ **AuthRepository** - Login e autenticação
- ✅ **OrderRepository** - Listar, detalhar, enviar e finalizar pedidos
- ✅ **ProductRepository** - Listar produtos por categoria

#### Customer
- ✅ **AuthRepository** - SignUp e SignIn
- ✅ **CatalogRepository** - Listar categorias e produtos
- ✅ **CartRepository** - Persistência de carrinho no LocalStorage

### 4. **UseCases (Lógica de Negócio)** ✓

#### Dashboard
- ✅ **LoginUseCase** - Autenticação de usuário
- ✅ **GetCurrentUserUseCase** - Recupera usuário logado
- ✅ **LogoutUseCase** - Logout
- ✅ **ListOrdersUseCase** - Lista todos os pedidos
- ✅ **DetailOrderUseCase** - Detalha um pedido
- ✅ **SendOrderUseCase** - Envia pedido para cozinha
- ✅ **FinishOrderUseCase** - Finaliza um pedido
- ✅ **ListProductsUseCase** - Lista produtos

#### Customer
- ✅ **SignUpUseCase** - Registro de novo cliente
- ✅ **SignInUseCase** - Login de cliente
- ✅ **ListProductsUseCase** - Lista todos os produtos
- ✅ **ListProductsByCategoryUseCase** - Filtra por categoria
- ✅ **AddToCartUseCase** - Adiciona item ao carrinho
- ✅ **GetCartUseCase** - Recupera itens do carrinho

### 5. **Páginas Next.js** ✓

#### Dashboard
```
/login                    - Página de login
/dashboard/orders         - Lista de pedidos (principal)
/                         - Index (redireciona para /login ou /dashboard/orders)
```

#### Customer
```
/signin                   - Página de login do cliente
/catalog                  - Catálogo de produtos (principal)
/cart                     - Carrinho de compras
/                         - Index (redireciona para /signin ou /catalog)
```

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- Backend rodando em `http://localhost:3333`

### Instalação

#### 1. Dashboard
```bash
cd frontPizzaria/dashboard
npm install
npm run dev
# Acesso: http://localhost:3000
```

#### 2. Customer
```bash
cd frontPizzaria/customer
npm install
npm run dev
# Acesso: http://localhost:3001 (ou a porta sugerida)
```

---

## 🧪 Testando a Aplicação

### Dashboard
**Credenciais de teste:**
- Email: `joao@email.com`
- Senha: `123456`

**Fluxo:**
1. Acesse `http://localhost:3000/login`
2. Faça login
3. Você será redirecionado para `/dashboard/orders`
4. Veja a lista de pedidos
5. Clique em "Enviar para Cozinha" ou "Finalizar"

### Customer
**Credenciais de teste:**
- Email: `maria@email.com`
- Senha: `123456`

**Fluxo:**
1. Acesse `http://localhost:3000/signin` (ou porta do customer)
2. Faça login
3. Você será redirecionado para `/catalog`
4. Navegue pelos produtos
5. Clique em "+ Adicionar" para adicionar ao carrinho
6. Clique em "Carrinho" para ver os itens
7. Clique em "Confirmar Pedido"

---

## 📁 Estrutura do Código

### Padrão DDD em cada aplicação

```
src/
├── shared/
│   ├── domain/
│   │   └── interfaces.ts       (IEntity, IRepository, IUseCase)
│   └── infra/
│       ├── http/
│       │   └── ApiClient.ts    (Cliente HTTP com interceptadores)
│       └── storage/
│           └── TokenStorage.ts  (Gerenciamento de tokens)
│
├── modules/
│   ├── auth/
│   │   ├── domain/
│   │   │   └── entities/
│   │   │       └── User.ts (ou Customer.ts)
│   │   ├── application/
│   │   │   └── usecases/
│   │   │       ├── LoginUseCase.ts
│   │   │       └── GetCurrentUserUseCase.ts
│   │   └── infra/
│   │       └── repositories/
│   │           └── AuthRepository.ts
│   │
│   ├── order/ (Dashboard only)
│   │   ├── domain/
│   │   │   └── entities/
│   │   │       └── Order.ts
│   │   ├── application/
│   │   │   └── usecases/
│   │   │       ├── ListOrdersUseCase.ts
│   │   │       ├── DetailOrderUseCase.ts
│   │   │       └── SendOrderUseCase.ts
│   │   └── infra/
│   │       └── repositories/
│   │           └── OrderRepository.ts
│   │
│   └── catalog/ (Customer only)
│       ├── domain/
│       │   └── entities/
│       │       └── Product.ts
│       ├── application/
│       │   └── usecases/
│       │       └── ListProductsUseCase.ts
│       └── infra/
│           └── repositories/
│               └── CatalogRepository.ts
│
└── pages/
    ├── login.tsx (ou signin.tsx)
    ├── index.tsx
    └── [module]/
        └── [page].tsx
```

---

## 🔑 Tecnologias Utilizadas

- **React 18** - UI Framework
- **Next.js 14** - Framework React fullstack
- **TypeScript 5** - Type safety
- **Axios** - HTTP Client
- **LocalStorage** - Client-side storage (sem biblioteca, nativo do navegador)

---

## 🎯 Fluxo de Dados - DDD

```
UI (Pages/Components)
    ↓
UseCase (Lógica de Negócio)
    ↓
Repository (Acesso a Dados)
    ↓
ApiClient/LocalStorage (Requisições/Armazenamento)
    ↓
Backend API / LocalStorage
```

---

## ⚡ Próximos Passos Opcionais

1. **State Management**
   - Implementar Context API para auth global
   - Ou usar Redux Toolkit para estado mais complexo

2. **Componentes Reutilizáveis**
   - Extrair componentes de formulário
   - Criar library de componentes (Button, Input, Card, etc)

3. **Estilos**
   - Implementar Tailwind CSS ou Styled Components
   - Criar sistema de design consistente

4. **Testes**
   - Jest para testes unitários
   - React Testing Library para testes de componentes
   - Cypress para testes E2E

5. **Melhorias**
   - Implementar refresh token
   - Adicionar loading states globais
   - Melhorar tratamento de erros
   - Adicionar validações de formulários

---

## 🚨 Variáveis de Ambiente

Criar arquivo `.env.local` em cada aplicação:

```bash
# Dashboard e Customer
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

---

## 📝 Notas Importantes

- ✅ Usando `'use client'` em páginas (Server Components com Client Component Pages)
- ✅ Path aliases configurados para imports limpos
- ✅ ApiClient com singleton pattern para compartilhamento
- ✅ TokenStorage safe para SSR (verifica `typeof window`)
- ✅ Repositórios com métodos de mapeamento de dados
- ✅ UseCases com Input/Output interfaces tipadas

---

## 🎓 Padrões Utilizados

1. **Domain-Driven Design (DDD)**
   - Separação clara de responsabilidades
   - Entidades com lógica de negócio
   - Casos de uso bem definidos

2. **Repository Pattern**
   - Abstrair acesso a dados
   - Facilitar testes com mocks

3. **Use Case Pattern**
   - Isolar lógica de negócio
   - Input/Output tipados
   - Reutilização entre componentes

4. **Dependency Injection**
   - Repositórios injetados nos UseCases
   - Facilita testes e manutenção

---

## 💡 Dicas de Desenvolvimento

1. Sempre tipifique suas variáveis e funções
2. Use interfaces para contratos claros
3. Mantenha componentes simples e focados
4. Extraia lógica complexa para UseCases
5. Teste seus UseCases antes de conectar aos componentes

---

✨ **Estrutura pronta para produção!**
