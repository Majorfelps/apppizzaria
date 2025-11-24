import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetCartUseCase } from '@/modules/cart/application/usecases/GetCartUseCase';
import { CartRepository } from '@/modules/cart/infra/repositories/CartRepository';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';
import { CreateOrderUseCase } from '@/modules/order/application/usecases/CreateOrderUseCase';
import { OrderRepository } from '@/modules/order/infra/repositories/OrderRepository';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tableName, setTableName] = useState('');
  const [tableNumber, setTableNumber] = useState('1');

  useEffect(() => {
    const initPage = async () => {
      try {
        const authRepository = new AuthRepository();
        const currentUser = authRepository.getCurrentUser();

        if (!currentUser) {
          router.push('/signin');
          return;
        }

        const cartRepository = new CartRepository();
        const getCartUseCase = new GetCartUseCase(cartRepository);
        const result = getCartUseCase.execute();

        setItems(result.items);
        setTotal(result.total);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    if (!tableName.trim()) {
      alert('Por favor, informe seu nome!');
      return;
    }

    try {
      setLoading(true);

      // Criar o pedido no backend
      const orderRepository = new OrderRepository();
      const createOrderUseCase = new CreateOrderUseCase(orderRepository);

      // Converter CartItem para o formato esperado pelo use case
      const cartRepository = new CartRepository();
      const cart = cartRepository.loadCart();

      await createOrderUseCase.execute({
        table: parseInt(tableNumber),
        name: tableName,
        items: cart.items,
      });

      alert('Pedido enviado com sucesso! Total: R$ ' + total.toFixed(2));
      
      // Limpar carrinho após sucesso
      cartRepository.clearCart();
      router.push('/catalog');
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao enviar pedido: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Carrinho</h1>
        <button
          onClick={() => router.push('/catalog')}
          style={styles.backButton}
        >
          ← Voltar ao Cardápio
        </button>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Seu carrinho está vazio</p>
          <button
            onClick={() => router.push('/catalog')}
            style={styles.continueButton}
          >
            Continuar Comprando
          </button>
        </div>
      ) : (
        <div style={styles.cartContent}>
          <div style={styles.itemsList}>
            {items.map((item) => (
              <div key={item.productId} style={styles.cartItem}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Quantidade: {item.quantity}</p>
                </div>
                <div style={styles.itemPrice}>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h3 style={{ marginBottom: '20px' }}>Informações do Pedido</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Nome:</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Digite seu nome"
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Mesa:</label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                min="1"
                style={styles.input}
              />
            </div>

            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Entrega:</span>
              <span>R$ 0.00</span>
            </div>
            <div style={{ ...styles.totalRow, ...styles.finalTotal }}>
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              style={styles.checkoutButton}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  } as React.CSSProperties,
  emptyCart: {
    backgroundColor: 'white',
    padding: '60px 20px',
    borderRadius: '8px',
    textAlign: 'center',
  } as React.CSSProperties,
  continueButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  } as React.CSSProperties,
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px',
  } as React.CSSProperties,
  itemsList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
  } as React.CSSProperties,
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: '1px solid #eee',
  } as React.CSSProperties,
  itemPrice: {
    textAlign: 'right',
  } as React.CSSProperties,
  summary: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px',
  } as React.CSSProperties,
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
  } as React.CSSProperties,
  finalTotal: {
    fontSize: '18px',
    fontWeight: 'bold',
    borderTop: '2px solid #eee',
    paddingTop: '12px',
    marginBottom: '20px',
  } as React.CSSProperties,
  checkoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  } as React.CSSProperties,
};
