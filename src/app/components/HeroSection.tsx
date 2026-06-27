'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { productStore, formatRupiah } from '@/lib/localStorage';
import { showToast } from '@/lib/toast';
import { cartStore } from '@/lib/localStorage';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState({
    name: 'Vitalis EDP Juicy Luxe',
    price: 119000,
    rating: 4.8,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt30DugTvY-mqg7JmANvwSdnOoAltL-RQMGg&s',
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    const products = productStore?.getAll();
    if (products?.length > 0) {
      const p = products?.[0];
      setFeaturedProduct({ name: p?.name, price: p?.price, rating: p?.rating, image: p?.image });
    }
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart = () => {
    cartStore?.add('prod_001', 1);
    window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
    showToast('Produk ditambahkan ke keranjang! 🛍️', 'success');
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden gradient-hero noise-overlay"
      style={{ paddingTop: '80px' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 blob-primary animate-float pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 blob-accent animate-float-slow pointer-events-none" />
      <div
        className="absolute top-10 right-1/3 w-48 h-48 blob-primary opacity-40 animate-float pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: Copy — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-7 relative z-10">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 self-start glass-card px-4 py-2 rounded-full transition-all duration-700 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="ping-rose absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Koleksi Terbaru 2026
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-hero-xl font-extrabold tracking-tight text-foreground transition-all duration-700 delay-100 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
            >
              Wewangian{' '}
              <span className="relative inline-block">
                <span
                  className="text-transparent"
                  style={{
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    backgroundImage:
                      'linear-gradient(135deg, #D4778A 0%, #C9956D 50%, #E8A0B0 100%)',
                  }}
                >
                  Elegan
                </span>
              </span>
              <br />
              untuk Wanita <span className="text-primary">Modern.</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg font-light leading-relaxed text-muted-foreground max-w-md transition-all duration-700 delay-200 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
            >
              Temukan parfum dan body care premium Vitalis — wewangian tahan lama yang mencerminkan
              kepribadian dan meningkatkan kepercayaan dirimu setiap hari.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-300 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
            >
              <Link href="/product-catalog" className="btn-primary text-base py-3.5 px-8">
                <Icon name="ShoppingBagIcon" size={18} />
                Belanja Sekarang
              </Link>
              <Link href="/product-catalog" className="btn-secondary text-base py-3.5 px-8">
                <Icon name="SparklesIcon" size={18} />
                Lihat Koleksi
              </Link>
            </div>

            {/* Social proof */}
            <div
              className={`pt-5 border-t border-border flex items-center gap-5 transition-all duration-700 delay-400 ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
            >
              <div className="flex -space-x-2.5">
                {[
                  { initials: 'SR', color: 'from-pink-400 to-rose-400' },
                  { initials: 'DM', color: 'from-rose-400 to-pink-500' },
                  { initials: 'AW', color: 'from-primary to-accent' },
                  { initials: '+', color: 'from-accent to-primary' },
                ]?.map((av, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${av?.color}`}
                  >
                    {av?.initials === '+' ? '2k+' : av?.initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)]?.map((_, i) => (
                    <svg key={i} className="w-4 h-4 star-filled" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dipercaya 2,000+ pelanggan setia
                </p>
              </div>
            </div>
          </div>

          {/* Right: Visual composition — 7 cols */}
          <div
            className={`lg:col-span-7 relative h-[560px] hidden lg:block transition-all duration-700 delay-200 ${visible ? 'animate-slide-right opacity-100' : 'opacity-0'}`}
          >
            <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full w-full">
              {/* Main tall image — col 1-5, all rows */}
              <div className="col-span-5 row-span-6 rounded-4xl overflow-hidden relative group cursor-pointer shadow-rose-xl">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_18a74cbdb-1767651330980.png"
                  alt="Parfum Vitalis EDP dalam botol kaca elegan dengan latar belakang bunga mawar pink lembut dan pencahayaan dramatis"
                  width={400}
                  height={560}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-pink-200 mb-1">
                    Unggulan
                  </p>
                  <h3 className="text-xl font-bold tracking-tight">EDP Juicy Luxe</h3>
                </div>
              </div>

              {/* Top right wide image — col 6-12, rows 1-3 */}
              <div className="col-span-7 row-span-3 rounded-4xl overflow-hidden relative group cursor-pointer shadow-rose-xl">
                <AppImage
                  src="https://images.unsplash.com/photo-1541108564883-bec8126021f5"
                  alt="Koleksi parfum premium dalam botol kaca bersih dengan latar belakang putih bersih dan pencahayaan studio"
                  width={700}
                  height={280}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 glass-card-dark px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-semibold text-white">Terlaris</span>
                </div>
              </div>

              {/* Bottom right image — col 6-9, rows 4-6 */}
              <div className="col-span-4 row-span-3 rounded-4xl overflow-hidden relative group cursor-pointer shadow-rose-xl">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_12180878c-1773000409794.png"
                  alt="Body wash mewah dalam kemasan elegan di atas permukaan marmer putih dengan bunga mawar segar"
                  width={350}
                  height={280}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Spinning circular element — col 10-12, rows 4-6 */}
              <div className="col-span-3 row-span-3 flex items-center justify-center relative">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg
                    className="w-full h-full absolute animate-spin-slow text-primary/40"
                    viewBox="0 0 100 100"
                  >
                    <path
                      id="circlePath"
                      d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                      fill="transparent"
                    />
                    <text className="text-[9px] uppercase font-bold fill-current">
                      <textPath href="#circlePath">
                        • Vitalis Beauty • Premium Fragrance •{' '}
                      </textPath>
                    </text>
                  </svg>
                  <button
                    onClick={handleAddToCart}
                    className="w-14 h-14 rounded-full gradient-pink flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-rose-lg z-10"
                    aria-label="Tambah ke keranjang"
                  >
                    <Icon name="ShoppingBagIcon" size={22} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating product card */}
            <div className="absolute top-[38%] right-[-24px] glass-card p-5 rounded-3xl w-60 shadow-rose-xl animate-float pointer-events-none">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Produk Pilihan
                </span>
                <Icon name="HeartIcon" size={16} className="text-primary" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <AppImage
                    src={featuredProduct?.image}
                    alt="Thumbnail produk parfum Vitalis unggulan"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {featuredProduct?.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 star-filled" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-muted-foreground">{featuredProduct?.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary">
                <span className="text-xs text-muted-foreground">Harga</span>
                <span className="text-sm font-bold text-primary">
                  {formatRupiah(featuredProduct?.price)}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-lg px-2.5 py-1.5">
                <Icon name="CheckCircleIcon" size={12} />
                Stok Tersedia
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-xs text-muted-foreground font-medium tracking-wide">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-primary/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-primary animate-float" />
        </div>
      </div>
    </section>
  );
}
