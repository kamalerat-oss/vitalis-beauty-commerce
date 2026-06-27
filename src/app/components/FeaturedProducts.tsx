'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { productStore, cartStore, formatRupiah } from '@/lib/localStorage';
import { showToast } from '@/lib/toast';
import type { Product } from '@/lib/localStorage';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
  console.log('product.id:', product.id);
  setAdding(true);
  cartStore.add(product.id, 1);
  console.log('cart setelah add:', localStorage.getItem('vitalis_cart'));
  window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
  showToast(`${product.name} ditambahkan ke keranjang! 🛍️`, 'success');
  setTimeout(() => setAdding(false), 800);
};

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="product-card group relative flex flex-col"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-square bg-secondary">
        <AppImage
          src={product.image}
          alt={`${product.name} — produk ${product.category} Vitalis Beauty dengan kemasan elegan`}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {false && (
            <span
              className={`badge text-xs font-bold shadow-sm ${
                product.badge === 'Best Seller'
                  ? 'badge-primary'
                  : product.badge === 'New'
                    ? 'badge-accent'
                    : 'badge-primary'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="badge bg-red-500 text-white font-bold text-xs">-{discount}%</span>
          )}
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className={`btn-primary text-xs py-2.5 px-5 shadow-rose-lg transition-all duration-300 ${
              adding ? 'scale-95' : 'translate-y-2 group-hover:translate-y-0'
            }`}
          >
            {adding ? (
              <>
                <Icon name="CheckIcon" size={14} /> Ditambahkan!
              </>
            ) : product.stock === 0 ? (
              'Stok Habis'
            ) : (
              <>
                <Icon name="ShoppingBagIcon" size={14} /> Tambah ke Keranjang
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <StarRating rating={4.5} />
          <span className="text-xs text-muted-foreground">(100)</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <p className="text-base font-extrabold text-foreground">
              {formatRupiah(product.price)}
            </p>
            {false && (
              <p className="text-xs text-muted-foreground line-through">
                {formatRupiah(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className="w-9 h-9 rounded-xl gradient-pink flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <Icon name={adding ? 'CheckIcon' : 'PlusIcon'} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      setProducts(data.slice(0, 3));
    } catch (error) {
      console.error("Gagal ambil produk", error);
    }
  };

  loadProducts();
}, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
              Pilihan Utama
            </span>
            <h2 className="text-hero-md font-extrabold text-foreground tracking-tight">
              Produk{' '}
              <span
                className="text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  backgroundImage: 'linear-gradient(135deg, #D4778A, #C9956D)',
                }}
              >
                Terlaris
              </span>
            </h2>
          </div>
          <Link
            href="/product-catalog"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
          >
            Lihat semua produk
            <Icon
              name="ArrowRightIcon"
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* 3-col product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-12 text-center">
          <Link href="/product-catalog" className="btn-secondary py-3.5 px-10 text-base">
            <Icon name="SparklesIcon" size={18} />
            Jelajahi Semua Koleksi
          </Link>
        </div>
      </div>
    </section>
  );
}
