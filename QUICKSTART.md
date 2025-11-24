# Guia de Início Rápido - App Pizzaria

Este guia ajudará você a configurar e executar o projeto rapidamente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 13 ou superior)
- [Git](https://git-scm.com/)
- npm (vem com Node.js)

## 🚀 Instalação Rápida

### 1. Clone o repositório

```bash
git clone https://github.com/Majorfelps/apppizzaria.git
cd apppizzaria
```

### 2. Configure o Backend

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

Exemplo de `.env`:
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/pizzaria?schema=public"
JWT_SECRET="minha_chave_secreta_123"
PORT=3333
```

### 3. Configure o Banco de Dados

```bash
# Execute as migrations
npx prisma migrate dev

# (Opcional) Abra o Prisma Studio para visualizar os dados
npx prisma studio
```

### 4. Inicie o Backend

```bash
npm run dev
```

O backend estará rodando em: `http://localhost:3333`

### 5. Configure o Frontend Dashboard

Abra um novo terminal:

```bash
cd frontPizzaria/dashboard
npm install

# Configure as variáveis de ambiente (se houver .env.example)
cp .env.example .env.local

npm run dev
```

Dashboard disponível em: `http://localhost:3000`

### 6. Configure o Frontend Customer (Opcional)

Abra outro terminal:

```bash
cd frontPizzaria/customer
npm install

# Configure as variáveis de ambiente (se houver .env.example)
cp .env.example .env.local

npm run dev
```

Customer app disponível em: `http://localhost:3001`

## 🧪 Testando a Aplicação

### Criar primeiro usuário

Use uma ferramenta como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/):

**POST** `http://localhost:3333/users`

```json
{
  "name": "Admin",
  "email": "admin@pizzaria.com",
  "password": "123456"
}
```

### Fazer login

**POST** `http://localhost:3333/session`

```json
{
  "email": "admin@pizzaria.com",
  "password": "123456"
}
```

Você receberá um token JWT. Use-o no header `Authorization: Bearer {token}` para requisições autenticadas.

## 📚 Próximos Passos

- Consulte o [README.md](README.md) para documentação completa
- Veja os [endpoints da API](README.md#-api-endpoints)
- Leia sobre a [arquitetura](frontPizzaria/ARQUITETURA.md)
- Confira os [próximos passos](PROXIMOS_PASSOS.md)

## 🆘 Problemas Comuns

### Erro de conexão com banco de dados

Verifique se:
- PostgreSQL está rodando
- As credenciais no `.env` estão corretas
- O banco de dados existe

### Porta já em uso

Se a porta 3333 (backend) ou 3000 (frontend) estiver em uso:
- Altere a porta no `.env` (backend)
- O Next.js automaticamente sugerirá outra porta

### Erro ao executar migrations

```bash
# Resete o banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Execute as migrations novamente
npx prisma migrate dev
```

## 💡 Dicas

- Use `npx prisma studio` para visualizar e editar dados facilmente
- Mantenha o backend rodando em um terminal separado
- Verifique os logs do terminal para debugar erros
- Consulte a documentação do Prisma: https://www.prisma.io/docs

---

Desenvolvido com ❤️ por [@Majorfelps](https://github.com/Majorfelps)
