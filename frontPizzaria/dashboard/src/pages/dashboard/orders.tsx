import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar } from '@/shared/components/Navbar';
import { ListOrdersUseCase } from '@/modules/order/application/usecases/ListOrdersUseCase';
import { SendOrderUseCase } from '@/modules/order/application/usecases/SendOrderUseCase';
import { FinishOrderUseCase } from '@/modules/order/application/usecases/FinishOrderUseCase';
import { OrderRepository } from '@/modules/order/infra/repositories/OrderRepository';
import { GetCurrentUserUseCase } from '@/modules/auth/application/usecases/GetCurrentUserUseCase';
import { AuthRepository as AuthRepo } from '@/modules/auth/infra/repositories/AuthRepository';

interface Order {
  id: string;
  table: number;
  name: string;
  status: string;
  total: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        // Verifica se usuário está logado
        const authRepository = new AuthRepo();
        const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
        const currentUser = getCurrentUserUseCase.execute();

        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);

        // Carrega pedidos
        const orderRepository = new OrderRepository();
        const listOrdersUseCase = new ListOrdersUseCase(orderRepository);
        const result = await listOrdersUseCase.execute();
        setOrders(result.orders);
      } catch (error) {
        console.error('Erro ao carregar página:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleSendOrder = async (orderId: string) => {
    try {
      const orderRepository = new OrderRepository();
      const sendOrderUseCase = new SendOrderUseCase(orderRepository);
      await sendOrderUseCase.execute({ orderId });
      // Recarrega pedidos
      const result = await new ListOrdersUseCase(orderRepository).execute();
      setOrders(result.orders);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido');
    }
  };

  const handleFinishOrder = async (orderId: string) => {
    try {
      const orderRepository = new OrderRepository();
      const finishOrderUseCase = new FinishOrderUseCase(orderRepository);
      await finishOrderUseCase.execute({ orderId });
      // Recarrega pedidos
      const result = await new ListOrdersUseCase(orderRepository).execute();
      setOrders(result.orders);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido');
    }
  };

  const handleLogout = () => {
    const authRepository = new AuthRepo();
    authRepository.logout();
    router.push('/login');
  };

  if (loading) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  return (
    <div style={styles.page}>
      <Navbar currentPage="orders" userName={user?.name} onLogout={handleLogout} />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Pedidos</h1>


        {orders.length === 0 ? (
          <p style={styles.noOrders}>Nenhum pedido encontrado</p>
        ) : (
          <div style={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <h3>Mesa {order.table}</h3>
                  <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status) }}>
                    {order.status}
                  </span>
                </div>
                <p><strong>Cliente:</strong> {order.name}</p>
                <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
                <div style={styles.orderActions}>
                  {order.status === 'draft' && (
                    <button
                      onClick={() => handleSendOrder(order.id)}
                      style={{ ...styles.actionButton, backgroundColor: '#4CAF50' }}
                    >
                      Enviar para Cozinha
                    </button>
                  )}
                  {order.status === 'sent' && (
                    <button
                      onClick={() => handleFinishOrder(order.id)}
                      style={{ ...styles.actionButton, backgroundColor: '#2196F3' }}
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: '#FFC107',
    sent: '#2196F3',
    finished: '#4CAF50',
  };
  return colors[status] || '#999';
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  } as React.CSSProperties,
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  } as React.CSSProperties,
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
  } as React.CSSProperties,
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
  } as React.CSSProperties,
  noOrders: {
    textAlign: 'center',
    padding: '60px 40px',
    color: '#999',
    backgroundColor: 'white',
    borderRadius: '8px',
  } as React.CSSProperties,
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  orderCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  } as React.CSSProperties,
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  orderActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  } as React.CSSProperties,
  actionButton: {
    flex: 1,
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
};
