interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  banner: string;
  onAddToCart: () => void;
}

export function ProductCard({
  name,
  description,
  price,
  banner,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        cursor: 'pointer',
      }}
    >
      <img
        src={banner}
        alt={name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          backgroundColor: '#f0f0f0',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://via.placeholder.com/300x200?text=Sem+imagem';
        }}
      />

      <div style={{ padding: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px' }}>
          {name}
        </h3>

        <p
          style={{
            margin: '0 0 12px 0',
            color: '#666',
            fontSize: '14px',
            minHeight: '40px',
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#e74c3c',
            }}
          >
            R$ {price.toFixed(2)}
          </span>

          <button
            onClick={onAddToCart}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                '#c0392b';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                '#e74c3c';
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
