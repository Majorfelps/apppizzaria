# 🍕 App Pizzaria - Frontend

Frontend da aplicação de pizzaria, dividido em duas aplicações React + TypeScript seguindo **Domain-Driven Design (DDD)**.

## 📁 Estrutura do Projeto

```
frontend/
├── dashboard/        # 🖥️ Aplicação Web Desktop para atendentes/gerentes
└── customer/         # 📱 Aplicação Web/Mobile para clientes
```

---

## 🖥️ DASHBOARD

Aplicação para gerenciamento de pedidos, produtos e atendimento na pizzaria.

### 📦 Módulos

- **Auth**: Autenticação de funcionários
- **Order**: Gerenciamento de pedidos (listar, criar, finalizar)
- **Product**: Catálogo de produtos (CRUD)

### 🏗️ Arquitetura

Segue o padrão **DDD** com 4 camadas:

```
presentation/ → application/ → domain/ → infra/
   (UI)         (UseCases)    (Lógica)  (API)
```

### 📂 Estrutura de Pasta

```
dashboard/src/
├── shared/                    # Código compartilhado
│   ├── domain/
│   │   └── interfaces.ts      # IRepository, IUseCase, IEntity
│   └── infra/
│       ├── http/              # API Client
│       └── storage/           # Token Storage
│
├── modules/
│   ├── auth/
│   │   ├── domain/entities/   # User.ts
│   │   ├── application/       # LoginUseCase.ts, LogoutUseCase.ts
│   │   ├── infra/             # AuthRepository.ts
│   │   └── presentation/      # LoginPage.tsx
│   │
│   ├── order/
│   │   ├── domain/entities/   # Order.ts, OrderStatus.ts
│   │   ├── application/       # ListOrdersUseCase.ts, etc
│   │   ├── infra/             # OrderRepository.ts
│   │   └── presentation/      # OrderListPage.tsx, OrderCard.tsx
│   │
│   └── product/
│       ├── domain/entities/   # Product.ts, Category.ts
│       ├── application/       # ListProductsUseCase.ts, etc
│       ├── infra/             # ProductRepository.ts
│       └── presentation/      # ProductListPage.tsx, etc
│
└── App.tsx                    # Root component
```

### 🚀 Como Iniciar

```bash
cd dashboard

# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 📝 Exemplo de Uso (UseCase)

```typescript
// application/usecases/ListOrdersUseCase.ts
export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}

// Uso em um componente
const listOrdersUseCase = new ListOrdersUseCase(orderRepository);
const orders = await listOrdersUseCase.execute();
```

---

## 📱 CUSTOMER

Aplicação para clientes visualizarem cardápio e fazer pedidos (web/mobile).

### 📦 Módulos

- **Auth**: Cadastro e login de clientes
- **Catalog**: Visualizar cardápio (produtos por categoria)
- **Cart**: Carrinho de compras (localStorage)

### 🏗️ Arquitetura

Mesmo padrão DDD do Dashboard.

### 📂 Estrutura de Pasta

```
customer/src/
├── shared/                    # Código compartilhado
│   ├── domain/
│   │   └── interfaces.ts
│   └── infra/
│       ├── http/              # API Client
│       └── storage/           # LocalStorage/AsyncStorage
│
├── modules/
│   ├── auth/
│   │   ├── domain/entities/   # Customer.ts
│   │   ├── application/       # SignUpUseCase.ts, SignInUseCase.ts
│   │   ├── infra/             # AuthRepository.ts
│   │   └── presentation/      # SignUpPage.tsx, SignInPage.tsx
│   │
│   ├── catalog/
│   │   ├── domain/entities/   # Product.ts, Category.ts
│   │   ├── application/       # ListProductsByCategoryUseCase.ts, etc
│   │   ├── infra/             # CatalogRepository.ts
│   │   └── presentation/      # CatalogPage.tsx, ProductCard.tsx
│   │
│   └── cart/
│       ├── domain/entities/   # Cart.ts, CartItem.ts
│       ├── application/       # AddToCartUseCase.ts, CreateOrderUseCase.ts
│       ├── infra/             # CartRepository.ts
│       └── presentation/      # CartPage.tsx, CartItem.tsx
│
└── App.tsx                    # Root component
```

### 🚀 Como Iniciar

```bash
cd customer

# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 🛒 Fluxo de Compra

1. **CatalogPage**: Cliente vê produtos por categoria
2. **AddToCartUseCase**: Adiciona item ao carrinho (localStorage)
3. **CartPage**: Revisa itens, quantidade e total
4. **CreateOrderUseCase**: Envia pedido para API backend
5. **Confirmação**: Pedido criado com sucesso

---

## 🔐 Autenticação

### Bearer Token

Cada aplicação armazena e gerencia seu próprio token:

```typescript
// Envio de requisição autenticada
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Interceptadores

O ApiClient adiciona automaticamente o token a cada requisição:

```typescript
// shared/infra/http/ApiClient.ts
export class ApiClient {
  private baseURL = 'http://localhost:3333';

  async request(config: AxiosRequestConfig) {
    const token = await TokenStorage.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return axios.request(config);
  }
}
```

---

## 🌐 Integração com Backend

O backend está em `/apppizzaria` na porta `3333`.

### Endpoints Utilizados

**Dashboard:**
- `POST /session` - Login
- `GET /orders` - Listar pedidos
- `GET /order/detail?order_id=...` - Detalhes do pedido
- `PUT /order/send` - Enviar pedido
- `PUT /order/finish` - Finalizar pedido
- `GET /category/product` - Listar produtos

**Customer:**
- `POST /users` - Cadastro
- `POST /session` - Login
- `GET /category/product` - Listar catálogo
- `POST /order` - Criar pedido
- `POST /order/add` - Adicionar item

---

## 📋 Convenções

### Arquivos
- `*.ts` - Lógica/Entidades
- `*.tsx` - Componentes React
- `*.test.ts(x)` - Testes

### Nomes
- **UseCase**: `{Action}{Entity}UseCase.ts`
  - ✅ `ListOrdersUseCase.ts`
  - ✅ `CreateOrderUseCase.ts`
- **Entity**: `{Name}.ts`
  - ✅ `Order.ts`
  - ✅ `Product.ts`
- **Component**: `{Name}.tsx`
  - ✅ `OrderCard.tsx`
  - ✅ `ProductList.tsx`
- **Page**: `{Feature}Page.tsx`
  - ✅ `OrderListPage.tsx`
  - ✅ `CatalogPage.tsx`

---

## 🛠️ Stack

```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "axios": "^1.x",
  "react-router-dom": "^6.x",
  "tailwindcss": "^3.x"
}
```

---

## 📚 Próximas Etapas

1. **Setup Inicial**
   - [ ] `npm install` em ambas as pastas
   - [ ] Criar `package.json` com scripts
   - [ ] Configurar TypeScript

2. **Implementar Repositórios**
   - [ ] AuthRepository
   - [ ] OrderRepository / ProductRepository / CatalogRepository
   - [ ] CartRepository

3. **Implementar UseCases**
   - [ ] Criar classes de UseCase
   - [ ] Injetar repositórios

4. **Implementar Componentes**
   - [ ] Pages
   - [ ] Components reutilizáveis
   - [ ] Formulários

5. **Integração**
   - [ ] State Management (Redux/Context)
   - [ ] Roteamento
   - [ ] Autenticação JWT

---

## 📖 Referências

- [DDD (Domain-Driven Design)](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

---

**Desenvolvido com ❤️ para App Pizzaria**
