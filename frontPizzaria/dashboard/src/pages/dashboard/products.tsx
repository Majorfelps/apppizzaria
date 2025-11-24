import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar } from '@/shared/components/Navbar';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';
import { GetCurrentUserUseCase } from '@/modules/auth/application/usecases/GetCurrentUserUseCase';
import { ProductRepository } from '@/modules/product/infra/repositories/ProductRepository';
import { ListProductsUseCase } from '@/modules/product/application/usecases/ListProductsUseCase';
import { CreateProductUseCase, UpdateProductUseCase } from '@/modules/product/application/usecases/CreateProductUseCase';
import { CategoryRepository } from '@/modules/category/infra/repositories/CategoryRepository';
import { ListCategoriesUseCase } from '@/modules/category/application/usecases/ListCategoriesUseCase';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category?: {
    name: string;
  };
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const loadProducts = async () => {
    try {
      const productRepository = new ProductRepository();
      const listProductsUseCase = new ListProductsUseCase(productRepository);
      const result = await listProductsUseCase.execute();
      setProducts(result.products.map((product: any) => ({
        ...product,
        price: product.price.toString(),
      })));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoryRepository = new CategoryRepository();
      const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
      const result = await listCategoriesUseCase.execute();
      setCategories(result.categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        const authRepository = new AuthRepository();
        const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
        const currentUser = getCurrentUserUseCase.execute();

        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);
        await Promise.all([loadProducts(), loadCategories()]);
      } catch (error) {
        console.error('Erro ao carregar página:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description || !formData.category_id) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!editingProduct && !imageFile) {
      alert('Selecione uma imagem para o produto');
      return;
    }

    try {
      setCreating(true);
      const productRepository = new ProductRepository();
      
      if (editingProduct) {
        // Atualizar produto
        const updateProductUseCase = new UpdateProductUseCase(productRepository);
        await updateProductUseCase.execute({
          product_id: editingProduct.id,
          name: formData.name,
          price: formData.price,
          description: formData.description,
          category_id: formData.category_id,
          file: imageFile || undefined,
        });
        setEditingProduct(null);
        alert('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        const createProductUseCase = new CreateProductUseCase(productRepository);
        await createProductUseCase.execute({
          name: formData.name,
          price: formData.price,
          description: formData.description,
          category_id: formData.category_id,
          file: imageFile!,
        });
        alert('Produto criado com sucesso!');
      }

      // Reset form
      setFormData({ name: '', price: '', description: '', category_id: '' });
      setImageFile(null);
      setImagePreview('');
      
      await loadProducts();
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category_id: product.categoryId || '',
    });
    setImagePreview(`${API_URL}/files/${product.banner}`);
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', category_id: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleLogout = () => {
    const authRepository = new AuthRepository();
    authRepository.logout();
    router.push('/login');
  };

  if (loading) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  return (
    <div style={styles.page}>
      <Navbar currentPage="products" userName={user?.name} onLogout={handleLogout} />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Gerenciar Produtos</h1>

        <div style={styles.content}>
          <div style={styles.formSection}>
            <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome do Produto:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Pizza Margherita"
                  style={styles.input}
                  disabled={creating}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Categoria:</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  style={styles.input}
                  disabled={creating}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Preço:</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: 35.00"
                  style={styles.input}
                  disabled={creating}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descrição:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o produto..."
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                  disabled={creating}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Imagem: {editingProduct && '(opcional - deixe em branco para manter a atual)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                  disabled={creating}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.submitButton} disabled={creating}>
                  {creating ? (editingProduct ? 'Atualizando...' : 'Criando...') : (editingProduct ? 'Atualizar Produto' : 'Criar Produto')}
                </button>
                {editingProduct && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit} 
                    style={{ ...styles.submitButton, backgroundColor: '#6c757d' }}
                    disabled={creating}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={styles.listSection}>
            <h2>Produtos Cadastrados ({products.length})</h2>
            {products.length === 0 ? (
              <p style={styles.emptyMessage}>Nenhum produto cadastrado ainda.</p>
            ) : (
              <div style={styles.productsList}>
                {products.map((product) => (
                  <div key={product.id} style={styles.productCard}>
                    <img
                      src={`${API_URL}/files/${product.banner}`}
                      alt={product.name}
                      style={styles.productImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                      }}
                    />
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productCategory}>
                        {product.category?.name || 'Sem categoria'}
                      </p>
                      <p style={styles.productDescription}>{product.description}</p>
                      <p style={styles.productPrice}>R$ {parseFloat(product.price).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={styles.editButton}
                    >
                      ✏️ Editar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
  content: {
    display: 'grid',
    gridTemplateColumns: '450px 1fr',
    gap: '30px',
  } as React.CSSProperties,
  formSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content',
  } as React.CSSProperties,
  form: {
    marginTop: '20px',
  } as React.CSSProperties,
  formGroup: {
    marginBottom: '20px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  } as React.CSSProperties,
  fileInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  } as React.CSSProperties,
  imagePreview: {
    marginTop: '10px',
    maxWidth: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
  } as React.CSSProperties,
  submitButton: {
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
  listSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: '40px 20px',
  } as React.CSSProperties,
  productsList: {
    display: 'grid',
    gap: '15px',
    marginTop: '20px',
  } as React.CSSProperties,
  productCard: {
    display: 'flex',
    gap: '15px',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  } as React.CSSProperties,
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
  } as React.CSSProperties,
  productInfo: {
    flex: 1,
  } as React.CSSProperties,
  productName: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    color: '#333',
  } as React.CSSProperties,
  productCategory: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    color: '#ff6b35',
    fontWeight: '500',
  } as React.CSSProperties,
  productDescription: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#666',
  } as React.CSSProperties,
  productPrice: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2e7d32',
  } as React.CSSProperties,
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    alignSelf: 'flex-start',
  } as React.CSSProperties,
};
