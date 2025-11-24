import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthRepository } from '@/modules/auth/infra/repositories/AuthRepository';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRepository = new AuthRepository();
        const currentUser = authRepository.getCurrentUser();

        if (!currentUser) {
          router.push('/signin');
          return;
        }

        router.push('/catalog');
      } catch (error) {
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router]);

  return <div>Carregando...</div>;
}
