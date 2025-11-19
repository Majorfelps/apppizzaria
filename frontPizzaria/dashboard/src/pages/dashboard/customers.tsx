import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Navbar } from '@/shared/components/Navbar';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';
import { GetCurrentUserUseCase } from '@/modules/auth/application/usecases/GetCurrentUserUseCase';
import { UserRepository } from '@/modules/user/infra/repositories/UserRepository';
import { ListUsersUseCase } from '@/modules/user/application/usecases/ListUsersUseCase';
import { UpdateUserUseCase } from '@/modules/user/application/usecases/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/modules/user/application/usecases/DeleteUserUseCase';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

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

        // Carregar usuários/clientes
        await loadCustomers();
      } catch (error) {
        console.error('Erro ao carregar página:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleLogout = () => {
    const authRepository = new AuthRepository();
    authRepository.logout();
    router.push('/login');
  };

  const loadCustomers = async () => {
    try {
      const userRepository = new UserRepository();
      const listUsersUseCase = new ListUsersUseCase(userRepository);
      const result = await listUsersUseCase.execute();
      setCustomers(result.users);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleEditUser = (customer: User) => {
    setEditingUser(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      password: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const userRepository = new UserRepository();
      const updateUserUseCase = new UpdateUserUseCase(userRepository);
      
      await updateUserUseCase.execute({
        user_id: editingUser.id,
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined
      });

      alert('Cliente atualizado com sucesso!');
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '' });
      await loadCustomers();
    } catch (error: any) {
      alert(`Erro ao atualizar cliente: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeleteClick = (customer: User) => {
    setUserToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const userRepository = new UserRepository();
      const deleteUserUseCase = new DeleteUserUseCase(userRepository);
      
      await deleteUserUseCase.execute(userToDelete.id);

      alert('Cliente excluído com sucesso!');
      setShowDeleteModal(false);
      setUserToDelete(null);
      await loadCustomers();
    } catch (error: any) {
      alert(`Erro ao excluir cliente: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  if (loading) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  if (editingUser) {
    return (
      <div style={styles.page}>
        <Navbar currentPage="customers" userName={user?.name} onLogout={handleLogout} />
        
        <div style={styles.container}>
          <h1 style={styles.title}>Editar Cliente</h1>

          <div style={styles.formContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
                placeholder="Nome do cliente"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
                placeholder="email@exemplo.com"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nova Senha (opcional)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={styles.input}
                placeholder="Deixe em branco para manter a atual"
              />
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={handleUpdateUser} style={styles.updateButton}>
                Atualizar Cliente
              </button>
              <button onClick={handleCancelEdit} style={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar currentPage="customers" userName={user?.name} onLogout={handleLogout} />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Clientes Cadastrados</h1>

        {showDeleteModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>Confirmar Exclusão</h2>
              <p style={styles.modalText}>
                Tem certeza que deseja excluir o cliente <strong>{userToDelete?.name}</strong>?
                <br />Esta ação não pode ser desfeita.
              </p>
              <div style={styles.modalButtons}>
                <button onClick={handleConfirmDelete} style={styles.confirmDeleteButton}>
                  Sim, Excluir
                </button>
                <button onClick={handleCancelDelete} style={styles.modalCancelButton}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.content}>
          {customers.length === 0 ? (
            <p style={styles.emptyMessage}>Nenhum cliente cadastrado ainda.</p>
          ) : (
            <div style={styles.customersTable}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Data de Cadastro</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} style={styles.tableRow}>
                      <td style={styles.td}>{customer.name}</td>
                      <td style={styles.td}>{customer.email}</td>
                      <td style={styles.td}>
                        {new Date(customer.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button 
                            onClick={() => handleEditUser(customer)} 
                            style={styles.editButton}
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(customer)} 
                            style={styles.deleteButton}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <h3 style={styles.statValue}>{customers.length}</h3>
              <p style={styles.statLabel}>Total de Clientes</p>
            </div>
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
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  } as React.CSSProperties,
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: '60px 20px',
  } as React.CSSProperties,
  customersTable: {
    overflowX: 'auto',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
  } as React.CSSProperties,
  th: {
    padding: '15px 20px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#495057',
    fontSize: '14px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  td: {
    padding: '15px 20px',
    color: '#212529',
    fontSize: '15px',
  } as React.CSSProperties,
  stats: {
    padding: '30px',
    borderTop: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'center',
  } as React.CSSProperties,
  statCard: {
    textAlign: 'center',
    padding: '20px 40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  } as React.CSSProperties,
  statValue: {
    margin: '0 0 5px 0',
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ff6b35',
  } as React.CSSProperties,
  statLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#6c757d',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  actionButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-start',
  } as React.CSSProperties,
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  } as React.CSSProperties,
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  } as React.CSSProperties,
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  } as React.CSSProperties,
  inputGroup: {
    marginBottom: '20px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
  } as React.CSSProperties,
  updateButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  } as React.CSSProperties,
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  } as React.CSSProperties,
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  modalTitle: {
    margin: '0 0 15px 0',
    fontSize: '24px',
    color: '#333',
  } as React.CSSProperties,
  modalText: {
    margin: '0 0 25px 0',
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5',
  } as React.CSSProperties,
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  confirmDeleteButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
  modalCancelButton: {
    padding: '10px 20px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
};
