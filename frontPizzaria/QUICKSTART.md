# 🚀 QUICK START - Frontend Next.js

## ⚡ Início Rápido

### 1. Dashboard
```bash
cd frontPizzaria/dashboard
npm install
npm run dev
# → http://localhost:3000
# Email: joao@email.com | Senha: 123456
```

### 2. Customer
```bash
cd frontPizzaria/customer
npm install
npm run dev
# → http://localhost:3000 (próxima porta)
# Email: maria@email.com | Senha: 123456
```

---

## 📁 Estrutura Criada

```
frontPizzaria/
├── dashboard/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login.tsx          ← Página de login
│   │   │   ├── index.tsx          ← Redireciona
│   │   │   └── dashboard/
│   │   │       └── orders.tsx     ← Lista de pedidos
│   │   ├── modules/
│   │   │   ├── auth/              ← Login, logout
│   │   │   ├── order/             ← Listar, enviar, finalizar
│   │   │   └── product/           ← Listar produtos
│   │   └── shared/
│   │       └── infra/             ← ApiClient, TokenStorage
│   ├── package.json               ✅ Criado
│   ├── tsconfig.json              ✅ Criado
│   ├── next.config.ts             ✅ Criado
│   └── .env.example               ✅ Criado
│
├── customer/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── signin.tsx         ← Login do cliente
│   │   │   ├── catalog.tsx        ← Catálogo de produtos
│   │   │   ├── cart.tsx           ← Carrinho
│   │   │   └── index.tsx          ← Redireciona
│   │   ├── modules/
│   │   │   ├── auth/              ← Login, signup
│   │   │   ├── catalog/           ← Produtos por categoria
│   │   │   └── cart/              ← Gerenciar carrinho
│   │   └── shared/
│   │       └── infra/             ← ApiClient, TokenStorage
│   ├── package.json               ✅ Criado
│   ├── tsconfig.json              ✅ Criado
│   ├── next.config.ts             ✅ Criado
│   └── .env.example               ✅ Criado
│
├── IMPLEMENTACAO.md               ✅ Guia completo
├── ARQUITETURA.md                 ← Revisado
└── README.md                       ← Revisado
```

---

## 🎯 Funcionalidades

### Dashboard (Atendente/Gerente)
- ✅ Login com JWT
- ✅ Listar pedidos
- ✅ Ver detalhes do pedido
- ✅ Enviar para cozinha
- ✅ Finalizar pedido
- ✅ Logout

### Customer (Cliente)
- ✅ Signup (registro)
- ✅ Login com JWT
- ✅ Ver catálogo de produtos
- ✅ Adicionar ao carrinho
- ✅ Ver carrinho
- ✅ Confirmar pedido
- ✅ Logout

---

## 🔗 Fluxo Técnico

### Autenticação
```
Formulário → UseCase → AuthRepository → ApiClient → Backend
```

### Dados
```
Página → UseCase → Repository → ApiClient/LocalStorage → Backend/Storage
```

### Proteção de Rotas
```
Página carrega → Verifica token → Redireciona se inválido
```

---

## 📦 Tecnologias

- React 18
- Next.js 14
- TypeScript 5
- Axios (HTTP)
- LocalStorage (Cart)

---

## 💾 Arquivos Principais

### Infraestrutura
- `src/shared/infra/http/ApiClient.ts` - Cliente HTTP com interceptadores
- `src/shared/infra/storage/TokenStorage.ts` - Gerenciamento de tokens

### Repositórios
- `modules/*/infra/repositories/*.ts` - Acesso a dados

### Casos de Uso
- `modules/*/application/usecases/*.ts` - Lógica de negócio

### Páginas
- `src/pages/*.tsx` - Componentes React Next.js

---

## 🧪 Testes Rápidos

### Dashboard
1. Acesse http://localhost:3000
2. Faça login com joao@email.com / 123456
3. Veja lista de pedidos
4. Clique em "Enviar para Cozinha"
5. Clique em "Finalizar"

### Customer
1. Acesse http://localhost:3001 (ou porta sugerida)
2. Faça login com maria@email.com / 123456
3. Veja produtos
4. Clique "+ Adicionar"
5. Clique "Carrinho (1)"
6. Clique "Confirmar Pedido"

---

## ⚙️ Variáveis de Ambiente

Criar `.env.local` em cada app:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

---

## 📋 Checklist

- ✅ Setup (package.json, tsconfig.json, next.config.ts)
- ✅ Infraestrutura (ApiClient, TokenStorage)
- ✅ Repositórios (6 total)
- ✅ UseCases (15 total)
- ✅ Páginas React (7 total)
- ✅ Autenticação JWT
- ✅ Proteção de rotas
- ✅ Carrinho persistido
- ⬜ State Management (opcional)
- ⬜ Tailwind CSS (opcional)
- ⬜ Testes (opcional)

---

## 🎓 Padrões Utilizados

1. **DDD** - Domain-Driven Design
2. **Repository Pattern** - Abstrair dados
3. **Use Case Pattern** - Isolar lógica
4. **Dependency Injection** - Injetar repositórios
5. **TypeScript** - Type safety

---

## 📚 Mais Informações

- Leia `IMPLEMENTACAO.md` para guia completo
- Leia `ARQUITETURA.md` para detalhes DDD
- Leia `README.md` para setup detalhado

---

**✨ Pronto para começar!**
