import * as React from "react";

interface OrderCardProps {
  table: number;
  name: string;
  status: string;
  total: number;
  onSendOrder?: () => void;
  onFinishOrder?: () => void;
}

export function OrderCard({
  table,
  name,
  status,
  total,
  onSendOrder,
  onFinishOrder,
}: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return '#ffc107'; // amarelo
      case 'sent':
        return '#17a2b8'; // azul
      case 'finished':
        return '#28a745'; // verde
      default:
        return '#6c757d'; // cinza
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'sent':
        return 'Enviado';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#333' }}>
            Mesa {table}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {name}
          </p>
        </div>
        <span
          style={{
            backgroundColor: getStatusColor(status),
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {getStatusLabel(status)}
        </span>
      </div>

      <div
        style={{
          borderTop: '1px solid #eee',
          paddingTop: '12px',
          marginBottom: '12px',
        }}
      >
        <p style={{ margin: '0 0 8px 0', color: '#333' }}>
          <strong>Total:</strong> R$ {total.toFixed(2)}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        {status === 'draft' && onSendOrder && (
          <button
            onClick={onSendOrder}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: '#17a2b8',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Enviar para Cozinha
          </button>
        )}
        {status === 'sent' && onFinishOrder && (
          <button
            onClick={onFinishOrder}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Finalizar Pedido
          </button>
        )}
        {status === 'finished' && (
          <button
            disabled
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: 0.6,
            }}
          >
            Pedido Finalizado
          </button>
        )}
      </div>
    </div>
  );
}
