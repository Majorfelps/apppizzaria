import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar } from '@/shared/components/Navbar';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';
import { GetCurrentUserUseCase } from '@/modules/auth/application/usecases/GetCurrentUserUseCase';
import { CategoryRepository } from '@/modules/category/infra/repositories/CategoryRepository';
import { ListCategoriesUseCase } from '@/modules/category/application/usecases/ListCategoriesUseCase';
import { CreateCategoryUseCase } from '@/modules/category/application/usecases/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '@/modules/category/application/usecases/UpdateCategoryUseCase';

interface Category {
  id: string;
  name: string;
  created_at: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');

  const loadCategories = async () => {
    try {
      const categoryRepository = new CategoryRepository();
      const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
      const result = await listCategoriesUseCase.execute();
      setCategories(result.categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Erro ao carregar categorias');
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
        await loadCategories();
      } catch (error) {
        console.error('Erro ao carregar página:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      alert('Digite o nome da categoria');
      return;
    }

    try {
      setCreating(true);
      const categoryRepository = new CategoryRepository();
      const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
      await createCategoryUseCase.execute({ name: newCategoryName });
      
      setNewCategoryName('');
      await loadCategories();
      alert('Categoria criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      alert('Erro ao criar categoria: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim() || !editingCategory) {
      alert('Digite o nome da categoria');
      return;
    }

    try {
      setCreating(true);
      const categoryRepository = new CategoryRepository();
      const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
      await updateCategoryUseCase.execute({ 
        category_id: editingCategory.id, 
        name: editName 
      });
      
      setEditingCategory(null);
      setEditName('');
      await loadCategories();
      alert('Categoria atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error);
      alert('Erro ao atualizar categoria: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
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
      <Navbar currentPage="categories" userName={user?.name} onLogout={handleLogout} />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Gerenciar Categorias</h1>

        <div style={styles.content}>
          <div style={styles.formSection}>
            <h2>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome da Categoria:</label>
                <input
                  type="text"
                  value={editingCategory ? editName : newCategoryName}
                  onChange={(e) => editingCategory ? setEditName(e.target.value) : setNewCategoryName(e.target.value)}
                  placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                  style={styles.input}
                  disabled={creating}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.submitButton} disabled={creating}>
                  {creating ? (editingCategory ? 'Atualizando...' : 'Criando...') : (editingCategory ? 'Atualizar Categoria' : 'Criar Categoria')}
                </button>
                {editingCategory && (
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
            <h2>Categorias Cadastradas ({categories.length})</h2>
            {categories.length === 0 ? (
              <p style={styles.emptyMessage}>Nenhuma categoria cadastrada ainda.</p>
            ) : (
              <div style={styles.categoriesList}>
                {categories.map((category) => (
                  <div key={category.id} style={styles.categoryCard}>
                    <div>
                      <h3 style={styles.categoryName}>{category.name}</h3>
                      <p style={styles.categoryDate}>
                        Criada em: {new Date(category.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditCategory(category)}
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
    maxWidth: '1200px',
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
    gridTemplateColumns: '400px 1fr',
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
  categoriesList: {
    display: 'grid',
    gap: '15px',
    marginTop: '20px',
  } as React.CSSProperties,
  categoryCard: {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties,
  categoryName: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    color: '#333',
  } as React.CSSProperties,
  categoryDate: {
    margin: 0,
    fontSize: '12px',
    color: '#999',
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
  } as React.CSSProperties,
};
