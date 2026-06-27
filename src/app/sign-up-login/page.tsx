import React from 'react';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import AuthPage from '@/app/sign-up-login/components/AuthPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk & Daftar — Vitalis Beauty Commerce',
  description:
    'Login atau buat akun baru di Vitalis Beauty Commerce untuk mulai belanja parfum dan body care premium.',
};

export default function SignUpLoginPage() {
  return (
    <>
      <StoreInitializer />
      <ToastProvider />
      <Header />
      <AuthPage />
    </>
  );
}
