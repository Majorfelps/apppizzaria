import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';
import { GetCurrentUserUseCase } from '@/modules/auth/application/usecases/GetCurrentUserUseCase';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRepository = new AuthRepository();
        const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
        const currentUser = getCurrentUserUseCase.execute();

        if (!currentUser) {
          router.push('/login');
          return;
        }

        // Redireciona para a página de pedidos
        router.push('/dashboard/orders');
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return <div>Carregando...</div>;
}
