# 🏗️ Arquitetura Frontend - App Pizzaria

Este documento descreve a estrutura arquitetural do frontend dividido em **Dashboard** (atendimento) e **Customer** (web/mobile para clientes).

## 📋 Estrutura DDD (Domain-Driven Design)

### Divisão de Responsabilidades

```
frontend/
├── dashboard/          # 🖥️ Aplicação para gerenciamento e atendimento
│   └── src/
│       ├── shared/     # Código compartilhado
│       └── modules/    # Módulos de negócio
│
└── customer/           # 📱 Aplicação Web/Mobile para clientes
    └── src/
        ├── shared/     # Código compartilhado
        └── modules/    # Módulos de negócio
```

---

## 🖥️ DASHBOARD (Atendimento e Gerenciamento)

### Módulos:

#### 1. **Auth Module**
- **Responsabilidade**: Autenticação de funcionários
- **Domain**: 
  - `User.ts` - Entidade de usuário funcionário
  - `AuthToken.ts` - Token JWT
- **Application**: 
  - `LoginUseCase.ts` - Login
  - `LogoutUseCase.ts` - Logout
- **Infra**: 
  - `AuthRepository.ts` - Integração com API
- **Presentation**:
  - `LoginPage.tsx` - Página de login

#### 2. **Order Module**
- **Responsabilidade**: Gerenciamento de pedidos, listagem, status
- **Domain**:
  - `Order.ts` - Entidade de pedido
  - `OrderStatus.ts` - Estados do pedido (draft, sent, finished)
  - `OrderItem.ts` - Items do pedido
- **Application**:
  - `ListOrdersUseCase.ts` - Listar pedidos
  - `DetailOrderUseCase.ts` - Ver detalhes
  - `ChangeOrderStatusUseCase.ts` - Atualizar status
  - `FinishOrderUseCase.ts` - Finalizar pedido
- **Infra**:
  - `OrderRepository.ts` - Chamadas API
- **Presentation**:
  - `OrderListPage.tsx` - Lista de pedidos
  - `OrderDetailPage.tsx` - Detalhes
  - `OrderCard.tsx` - Componente de exibição

#### 3. **Product Module**
- **Responsabilidade**: Gerenciamento de catálogo de produtos
- **Domain**:
  - `Product.ts` - Entidade de produto
  - `Category.ts` - Categorias
- **Application**:
  - `ListProductsUseCase.ts` - Listar produtos
  - `ListCategoriesUseCase.ts` - Listar categorias
  - `CreateProductUseCase.ts` - Criar produto
  - `UpdateProductUseCase.ts` - Atualizar produto
- **Infra**:
  - `ProductRepository.ts` - Chamadas API
- **Presentation**:
  - `ProductListPage.tsx` - Lista de produtos
  - `ProductFormPage.tsx` - Formulário criar/editar

### Fluxo de Dados (Pedido na Cozinha)

```
Recebimento → Preparação → Pronto → Entregue
   (draft)      (sent)    (finish)   (closed)
```

---

## 📱 CUSTOMER (Cliente - Web/Mobile)

### Módulos:

#### 1. **Auth Module**
- **Responsabilidade**: Autenticação de clientes
- **Domain**:
  - `Customer.ts` - Entidade de cliente
  - `AuthToken.ts` - Token JWT
- **Application**:
  - `SignUpUseCase.ts` - Cadastro
  - `SignInUseCase.ts` - Login
- **Infra**:
  - `AuthRepository.ts` - Integração com API
- **Presentation**:
  - `SignUpPage.tsx` - Página de cadastro
  - `SignInPage.tsx` - Página de login

#### 2. **Catalog Module**
- **Responsabilidade**: Exibição de produtos/cardápio
- **Domain**:
  - `Product.ts` - Entidade de produto
  - `Category.ts` - Categorias
- **Application**:
  - `ListProductsByCategoryUseCase.ts` - Listar por categoria
  - `SearchProductsUseCase.ts` - Buscar produtos
  - `GetProductDetailUseCase.ts` - Detalhes do produto
- **Infra**:
  - `CatalogRepository.ts` - Chamadas API
- **Presentation**:
  - `CatalogPage.tsx` - Catálogo/Menu
  - `CategoryTabComponent.tsx` - Abas de categorias
  - `ProductCardComponent.tsx` - Card de produto

#### 3. **Cart Module**
- **Responsabilidade**: Carrinho de compras local
- **Domain**:
  - `CartItem.ts` - Item no carrinho
  - `Cart.ts` - Carrinho
- **Application**:
  - `AddToCartUseCase.ts` - Adicionar ao carrinho
  - `RemoveFromCartUseCase.ts` - Remover do carrinho
  - `UpdateCartItemUseCase.ts` - Atualizar quantidade
  - `ClearCartUseCase.ts` - Limpar carrinho
  - `CreateOrderUseCase.ts` - Criar pedido a partir do carrinho
- **Infra**:
  - `CartRepository.ts` - LocalStorage/AsyncStorage
  - `OrderRepository.ts` - Integração com API
- **Presentation**:
  - `CartPage.tsx` - Página do carrinho
  - `CartItemComponent.tsx` - Item no carrinho
  - `CheckoutComponent.tsx` - Resumo e finalizar

---

## 🔄 Fluxo de Dados

### No Dashboard:
```
API Backend → OrderRepository → ListOrdersUseCase → OrderListPage → Componentes
```

### No Customer:
```
User → CatalogPage → AddToCart (LocalStorage) → CartPage → CheckoutComponent → CreateOrder API
```

---

## 📦 Shared (Compartilhado)

### `/shared/domain`
- `IRepository.ts` - Interface base para repositórios
- `UseCase.ts` - Interface base para casos de uso
- `Entity.ts` - Classe base para entidades
- `HttpClient.ts` - Interface para cliente HTTP

### `/shared/infra/http`
- `ApiClient.ts` - Cliente HTTP com interceptadores
- `TokenStorage.ts` - Armazenamento de token
- `ApiConfig.ts` - Configurações da API

### `/shared/infra/storage`
- `LocalStorage.ts` - Wrapper para localStorage
- `AsyncStorage.ts` - Wrapper para AsyncStorage (React Native)

---

## 🛠️ Stack Recomendado

### Dashboard (Web Desktop)
- **Framework**: React + TypeScript
- **State**: Redux Toolkit ou Context API
- **UI**: Tailwind CSS ou Material-UI
- **HTTP**: Axios
- **Roteamento**: React Router v6

### Customer (Web/Mobile)
- **Web**: React + TypeScript
- **Mobile**: React Native ou Expo
- **State**: Redux Toolkit ou Context API
- **UI Web**: Tailwind CSS
- **UI Mobile**: React Native Paper ou Native Base
- **HTTP**: Axios
- **Roteamento**: React Router (web) / React Navigation (mobile)

---

## 📝 Convenções de Nomes

- **UseCase**: `{Action}{Entity}UseCase.ts` (ex: `CreateOrderUseCase.ts`)
- **Repository**: `{Entity}Repository.ts` (ex: `OrderRepository.ts`)
- **Entity**: `{EntityName}.ts` (ex: `Order.ts`)
- **Component**: `{ComponentName}.tsx` (ex: `OrderCard.tsx`)
- **Page**: `{FeatureName}Page.tsx` (ex: `OrderListPage.tsx`)
- **Interfaces**: `I{Name}.ts` (ex: `IOrderRepository.ts`)

---

## 🔐 Autenticação e Segurança

- **Token**: Armazenado em localStorage (web) ou AsyncStorage (mobile)
- **Interceptor**: Adiciona Bearer token a cada requisição
- **Refresh**: Implementar refresh token automático
- **Logout**: Limpar token e redirecionar para login

---

## 📚 Exemplo de Estrutura de Arquivo

```
modules/order/
├── domain/
│   ├── entities/
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   └── OrderStatus.ts
│   └── interfaces/
│       └── IOrderRepository.ts
├── application/
│   ├── usecases/
│   │   ├── ListOrdersUseCase.ts
│   │   ├── DetailOrderUseCase.ts
│   │   └── ChangeOrderStatusUseCase.ts
│   └── dtos/
│       └── OrderDTO.ts
├── infra/
│   └── repositories/
│       └── OrderRepository.ts
└── presentation/
    ├── pages/
    │   ├── OrderListPage.tsx
    │   └── OrderDetailPage.tsx
    └── components/
        ├── OrderCard.tsx
        └── OrderStatus.tsx
```

---

## 🚀 Próximos Passos

1. Criar `package.json` para cada aplicação
2. Configurar TypeScript e ESLint
3. Implementar entidades de domínio
4. Criar repositórios e casos de uso
5. Desenvolver componentes de apresentação
6. Integrar com API backend

