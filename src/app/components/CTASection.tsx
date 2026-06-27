import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'linear-gradient(135deg, #FDE8ED 0%, #F5C6D0 30%, #FDDDE6 60%, #F5E6E8 100%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 blob-primary animate-float pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-56 h-56 blob-accent animate-float-slow pointer-events-none opacity-50" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
          <Icon name="SparklesIcon" size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">Live Your Dream.</span>
        </div>

        <h2 className="text-hero-md font-extrabold text-foreground tracking-tight mb-5">
          Mulai Perjalanan{' '}
          <span
            className="text-transparent"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #D4778A, #C9956D)',
            }}
          >
            Wewangianmu
          </span>{' '}
          Hari Ini
        </h2>

        <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10 max-w-xl mx-auto">
          Bergabunglah dengan jutaan wanita Indonesia yang telah menemukan wewangian sempurna mereka
          bersama Vitalis Beauty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/product-catalog" className="btn-primary text-base py-4 px-10">
            <Icon name="ShoppingBagIcon" size={18} />
            Belanja Sekarang
          </Link>
          <Link href="/sign-up-login" className="btn-secondary text-base py-4 px-10">
            <Icon name="UserPlusIcon" size={18} />
            Daftar Gratis
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Gratis ongkir min. pembelian Rp 300.000 • Pembayaran aman • Garansi keaslian produk
        </p>
      </div>
    </section>
  );
}
