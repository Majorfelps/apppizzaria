import React from 'react';
import { useRouter } from 'next/router';

interface NavbarProps {
  currentPage: 'orders' | 'products' | 'categories' | 'customers';
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ currentPage, userName, onLogout }: NavbarProps) {
  const router = useRouter();

  const navItems = [
    { key: 'orders', label: 'Pedidos', path: '/dashboard/orders' },
    { key: 'categories', label: 'Categorias', path: '/dashboard/categories' },
    { key: 'products', label: 'Produtos', path: '/dashboard/products' },
    { key: 'customers', label: 'Clientes', path: '/dashboard/customers' },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <h2>🍕 Pizzaria Admin</h2>
        </div>
        
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(item.path)}
              style={{
                ...styles.navButton,
                ...(currentPage === item.key ? styles.navButtonActive : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={styles.userSection}>
          {userName && <span style={styles.userName}>{userName}</span>}
          <button onClick={onLogout} style={styles.logoutButton}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  } as React.CSSProperties,
  logo: {
    margin: 0,
  } as React.CSSProperties,
  navLinks: {
    display: 'flex',
    gap: '10px',
    flex: 1,
    justifyContent: 'center',
  } as React.CSSProperties,
  navButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  navButtonActive: {
    backgroundColor: '#ff6b35',
  } as React.CSSProperties,
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  } as React.CSSProperties,
  userName: {
    fontSize: '14px',
    color: '#ddd',
  } as React.CSSProperties,
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
};
