import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import ChatbotWidget from '@/components/ChatbotWidget';
import StoreInitializer from '@/app/components/StoreInitializer';
import ProductCatalogPage from '@/app/product-catalog/components/ProductCatalogPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Produk — Vitalis Beauty Commerce',
  description:
    'Temukan semua produk Vitalis Beauty: Eau de Parfum, Body Wash, Body Scent, dan Deodorant premium untuk wanita Indonesia.',
};

export default function ProductCatalog() {
  return (
    <>
      <StoreInitializer />
      <ToastProvider />
      <Header />
      <main className="min-h-screen pt-16 lg:pt-20">
        <ProductCatalogPage />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
