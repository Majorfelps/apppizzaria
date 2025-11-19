import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ListProductsUseCase } from '@/modules/catalog/application/usecases/ListProductsUseCase';
import { CatalogRepository } from '@/modules/catalog/infra/repositories/CatalogRepository';
import { AddToCartUseCase } from '@/modules/cart/application/usecases/AddToCartUseCase';
import { CartRepository } from '@/modules/cart/infra/repositories/CartRepository';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  banner: string;
  category: {
    id: string;
    name: string;
  };
}

interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  products: Product[];
}

export default function CatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const initPage = async () => {
      try {
        // Verifica se usuário está logado
        const authRepository = new AuthRepository();
        const currentUser = authRepository.getCurrentUser();

        if (!currentUser) {
          router.push('/signin');
          return;
        }

        setUser(currentUser);

        // Carrega produtos
        const catalogRepository = new CatalogRepository();
        const listProductsUseCase = new ListProductsUseCase(catalogRepository);
        const result = await listProductsUseCase.execute();
        setProducts(result.products);

        // Organiza produtos por categoria
        const grouped = groupProductsByCategory(result.products);
        setCategorizedProducts(grouped);

        // Carrega contador do carrinho
        const cartRepository = new CartRepository();
        const cart = cartRepository.loadCart();
        setCartCount(cart.getItemCount());
      } catch (error) {
        console.error('Erro ao carregar página:', error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const groupProductsByCategory = (products: Product[]): CategoryGroup[] => {
    const categoryMap = new Map<string, CategoryGroup>();

    products.forEach((product) => {
      const categoryId = product.category.id;
      
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categoryId: categoryId,
          categoryName: product.category.name,
          products: [],
        });
      }

      categoryMap.get(categoryId)!.products.push(product);
    });

    return Array.from(categoryMap.values());
  };

  const handleAddToCart = (product: Product) => {
    try {
      const cartRepository = new CartRepository();
      const addToCartUseCase = new AddToCartUseCase(cartRepository);

      addToCartUseCase.execute({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productBanner: product.banner,
        quantity: 1,
      });

      setCartCount(cartCount + 1);
      alert(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
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
        <h1>Cardápio</h1>
        <div>
          <span>Bem-vindo, {user?.name}</span>
          <button
            onClick={() => router.push('/cart')}
            style={styles.cartButton}
          >
            🛒 Carrinho ({cartCount})
          </button>
          <button
            onClick={() => {
              const authRepository = new AuthRepository();
              authRepository.logout();
              router.push('/signin');
            }}
            style={styles.logoutButton}
          >
            Sair
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p style={styles.noProducts}>Nenhum produto encontrado</p>
      ) : (
        <div>
          {categorizedProducts.map((categoryGroup) => (
            <div key={categoryGroup.categoryId} style={styles.categorySection}>
              <h2 style={styles.categoryTitle}>{categoryGroup.categoryName}</h2>
              <div style={styles.productsGrid}>
                {categoryGroup.products.map((product) => (
                  <div key={product.id} style={styles.productCard}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333'}/files/${product.banner}`}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    <div style={styles.productContent}>
                      <h3>{product.name}</h3>
                      <p style={styles.description}>{product.description}</p>
                      <div style={styles.productFooter}>
                        <span style={styles.price}>R$ {product.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          style={styles.addButton}
                        >
                          + Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
  cartButton: {
    marginLeft: '10px',
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  } as React.CSSProperties,
  logoutButton: {
    marginLeft: '10px',
    padding: '8px 16px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  } as React.CSSProperties,
  noProducts: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  } as React.CSSProperties,
  categorySection: {
    marginBottom: '40px',
  } as React.CSSProperties,
  categoryTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '3px solid #ff6b35',
    paddingBottom: '10px',
    display: 'inline-block',
  } as React.CSSProperties,
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  productCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties,
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  } as React.CSSProperties,
  productContent: {
    padding: '16px',
  } as React.CSSProperties,
  description: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
    minHeight: '40px',
  } as React.CSSProperties,
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ff6b35',
  } as React.CSSProperties,
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  } as React.CSSProperties,
};
