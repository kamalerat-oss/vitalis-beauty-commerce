import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import SplashScreen from '@/components/SplashScreen';
import ChatbotWidget from '@/components/ChatbotWidget';
import HeroSection from '@/app/components/HeroSection';
import FeaturedProducts from '@/app/components/FeaturedProducts';
import WhyVitalis from '@/app/components/WhyVitalis';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import CTASection from '@/app/components/CTASection';
import StoreInitializer from '@/app/components/StoreInitializer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vitalis Beauty — Parfum & Body Care Premium Indonesia',
  description:
    'Belanja parfum dan body care premium Vitalis Beauty. Wewangian elegan, tahan lama, harga terjangkau. Pengiriman ke seluruh Indonesia.',
};

export default function HomePage() {
  return (
    <>
      <StoreInitializer />
      <SplashScreen />
      <ToastProvider />
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedProducts />
        <WhyVitalis />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
