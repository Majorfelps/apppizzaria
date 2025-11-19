# 🧪 Guia de Testes Manuais - Aplicação Pizzaria

## 🎯 Objetivo
Este guia fornece instruções passo a passo para testar manualmente as funcionalidades da aplicação Pizzaria.

---

## 🚀 Pré-requisitos

✅ Backend rodando em `localhost:3333`  
✅ Dashboard rodando em `localhost:3000`  
✅ Customer rodando em `localhost:3001`  

### Usuários de Teste Disponíveis:
- **Dashboard:** joao@email.com / 123456
- **Customer:** maria@email.com / 123456

---

## 📝 Teste 1: Login no Dashboard

### Passo a Passo:
1. Acesse http://localhost:3000/login
2. Preencha com:
   - Email: `joao@email.com`
   - Senha: `123456`
3. Clique em "Entrar"

### Resultado Esperado:
- ✅ Usuário autenticado
- ✅ Redirecionamento para `/dashboard/orders`
- ✅ Token JWT salvo no localStorage

### Como Verificar:
```javascript
// Abra o DevTools (F12) → Console e execute:
localStorage.getItem('@pizzaria:token')
localStorage.getItem('@pizzaria:user')
```

---

## 📝 Teste 2: Listagem de Pedidos (Dashboard)

### Localização:
- **URL:** http://localhost:3000/dashboard/orders
- **Acesso:** Após fazer login no Dashboard

### Resultado Esperado:
- ✅ Lista de pedidos carregando
- ✅ Cards com informações: Pedido, Mesa, Status, Total
- ✅ Botões de ação (Enviar, Finalizar)

### Dados de Exemplo:
- Categoria de status: Draft, Sent, Finished
- Cores: Amarelo (Draft), Azul (Sent), Verde (Finished)

---

## 📝 Teste 3: Ações nos Pedidos (Dashboard)

### Teste 3a: Alterar Status de Pedido
1. Na lista de pedidos, identifique um pedido em status "Draft"
2. Clique em "Enviar" (botão azul)

### Resultado Esperado:
- ✅ Status muda de "Draft" para "Sent"
- ✅ Botão muda para "Finalizar"

### Teste 3b: Finalizar Pedido
1. Em um pedido com status "Sent", clique em "Finalizar"

### Resultado Esperado:
- ✅ Status muda de "Sent" para "Finished"
- ✅ Botão fica desabilitado

---

## 📝 Teste 4: Login no Customer

### Passo a Passo:
1. Acesse http://localhost:3001/signin
2. Preencha com:
   - Email: `maria@email.com`
   - Senha: `123456`
3. Clique em "Entrar"

### Resultado Esperado:
- ✅ Usuário autenticado
- ✅ Redirecionamento para `/catalog`
- ✅ Token JWT salvo no localStorage

---

## 📝 Teste 5: Catálogo de Produtos (Customer)

### Localização:
- **URL:** http://localhost:3001/catalog
- **Acesso:** Após fazer login no Customer

### Resultado Esperado:
- ✅ Lista de produtos carregando
- ✅ Cards de produtos com: Imagem, Nome, Descrição, Preço
- ✅ Botão "Adicionar ao Carrinho" em cada produto

### Filtros Esperados:
- Deve haver categorias para filtrar produtos

---

## 📝 Teste 6: Adicionar Produtos ao Carrinho

### Passo a Passo:
1. No catálogo, clique em "Adicionar ao Carrinho" em qualquer produto
2. Clique novamente no mesmo produto

### Resultado Esperado:
- ✅ Produto adicionado ao carrinho
- ✅ Quantidade aumenta (se clicar novamente)
- ✅ Carrinho atualiza com a quantidade

### Verificação:
```javascript
// DevTools → Console:
localStorage.getItem('@pizzaria:cart')
```

---

## 📝 Teste 7: Gerenciar Carrinho (Customer)

### Localização:
- **URL:** http://localhost:3001/cart
- **Acesso:** Clique no carrinho ou acesse diretamente

### Resultado Esperado:
- ✅ Lista de itens do carrinho
- ✅ Informações: Produto, Preço, Quantidade, Subtotal
- ✅ Botões para aumentar/diminuir quantidade
- ✅ Botão para remover item
- ✅ Total geral do carrinho
- ✅ Botão "Checkout"

### Teste 7a: Aumentar Quantidade
1. Clique no botão "+" em qualquer item

### Resultado Esperado:
- ✅ Quantidade aumenta
- ✅ Subtotal e total são recalculados

### Teste 7b: Diminuir Quantidade
1. Clique no botão "-" em qualquer item

### Resultado Esperado:
- ✅ Quantidade diminui
- ✅ Se quantidade chegar a 0, item é removido

### Teste 7c: Remover Item
1. Clique no botão "Remover" em qualquer item

### Resultado Esperado:
- ✅ Item removido do carrinho
- ✅ Total recalculado

---

## 📝 Teste 8: Checkout (Criar Pedido)

### Passo a Passo:
1. Adicione alguns produtos ao carrinho
2. Vá para http://localhost:3001/cart
3. Clique em "Finalizar Pedido" (Checkout)
4. Preencha com os dados:
   - Número da Mesa: `1` (ou outro número)
   - Nome do Cliente: `João Silva` (ou outro nome)

### Resultado Esperado:
- ✅ Pedido criado com sucesso
- ✅ Mensagem de confirmação
- ✅ Redirecionamento para o catálogo
- ✅ Carrinho limpo

### Verificação no Backend:
```bash
curl -s -H "Authorization: Bearer <token>" \
  http://localhost:3333/orders | jq '.'
```

---

## 📝 Teste 9: Novo Pedido Aparece no Dashboard

### Passo a Passo:
1. Crie um pedido no Customer (Teste 8)
2. Faça login no Dashboard (Teste 1)
3. Vá para http://localhost:3000/dashboard/orders

### Resultado Esperado:
- ✅ Novo pedido aparece na lista
- ✅ Status está como "Draft"
- ✅ Mesa e nome correspondem aos dados informados
- ✅ Total corresponde ao valor do carrinho

---

## 📝 Teste 10: Signup (Cadastro) - Dashboard

### Passo a Passo:
1. Acesse http://localhost:3000/signup
2. Preencha com:
   - Nome: `João Novo`
   - Email: `joao.novo@email.com`
   - Senha: `123456`
3. Clique em "Cadastrar"

### Resultado Esperado:
- ✅ Usuário criado com sucesso
- ✅ Redirecionamento para login
- ✅ Agora pode fazer login com novos dados

---

## 📝 Teste 11: Signup (Cadastro) - Customer

### Passo a Passo:
1. Acesse http://localhost:3001/signup
2. Preencha com:
   - Email: `cliente.novo@email.com`
   - Senha: `123456`
   - Confirmar Senha: `123456`
3. Clique em "Cadastrar"

### Resultado Esperado:
- ✅ Usuário criado com sucesso
- ✅ Redirecionamento para signin
- ✅ Agora pode fazer login com novos dados

---

## 🔍 Testes de Validação

### Teste: Email Duplicado
1. Tente fazer signup com um email que já existe
2. Resultado esperado: ✅ Mensagem de erro "Usuário já existe"

### Teste: Senha Incorreta
1. Tente fazer login com email correto mas senha errada
2. Resultado esperado: ✅ Mensagem de erro "Credenciais inválidas"

### Teste: Campos Vazios
1. Tente fazer login/signup com campos em branco
2. Resultado esperado: ✅ Validação de formulário

---

## 🔐 Testes de Segurança

### Teste: Token Inválido
1. Abra DevTools → Console
2. Execute: `localStorage.setItem('@pizzaria:token', 'token_invalido')`
3. Recarregue a página ou acesse uma rota protegida
4. Resultado esperado: ✅ Redirecionamento para login

### Teste: Acesso sem Autenticação
1. Limpe o localStorage: `localStorage.clear()`
2. Tente acessar http://localhost:3000/dashboard/orders
3. Resultado esperado: ✅ Redirecionamento para login

---

## 📊 Testes de Performance

### Verificar Tempo de Carregamento
1. Abra DevTools → Network
2. Acesse as páginas e observe:
   - Dashboard/Orders: < 1s
   - Customer/Catalog: < 1s
   - Customer/Cart: < 500ms

---

## 🐛 Testes de Erro Esperados

### Desconectar o Backend
1. Pare o servidor backend
2. Tente fazer login
3. Resultado esperado: ✅ Mensagem de erro clara

### Reconectar Backend
1. Reinicie o backend
2. O frontend deve se recuperar automaticamente

---

## ✅ Checklist Final

- [ ] Login Dashboard funciona
- [ ] Login Customer funciona
- [ ] Listagem de pedidos carrega
- [ ] Listagem de produtos carrega
- [ ] Adicionar produto ao carrinho funciona
- [ ] Criar pedido funciona
- [ ] Novo pedido aparece no Dashboard
- [ ] Alterar status do pedido funciona
- [ ] Signup funciona em ambas aplicações
- [ ] Validações funcionam
- [ ] Token persiste no localStorage
- [ ] Redirecionamento para login quando não autenticado

---

## 📞 Suporte

Se encontrar algum erro durante os testes, verifique:

1. **Servidores estão rodando?**
   ```bash
   ps aux | grep "node\|ts-node"
   ```

2. **Logs do Backend:**
   ```bash
   tail -20 /tmp/backend.log
   ```

3. **DevTools do Navegador (F12):**
   - Console: Verificar erros JavaScript
   - Network: Verificar requisições HTTP
   - Application: Verificar localStorage

---

**Última atualização:** 19 de novembro de 2025
