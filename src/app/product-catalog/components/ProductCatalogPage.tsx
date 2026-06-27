'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import {
  productStore,
  cartStore,
  formatRupiah,
  initializeStore,
  sessionStore,
} from '@/lib/localStorage';
import { showToast } from '@/lib/toast';
import type { Product } from '@/lib/localStorage';

// ── Star Rating ───────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Product Detail Modal ──────────────────────────────
function ProductDetailModal({
  product,
  onClose,
  isAdmin,
}: {
  product: Product;
  onClose: () => void;
  isAdmin: boolean;
}) {
  const requireCustomer = () => {
    const user = sessionStore.get();
    if (!user || user.role !== 'customer') {
      showToast('Silakan login/daftar terlebih dahulu untuk menambahkan ke keranjang.', 'warning');
      return false;
    }
    return true;
  };
  // Admin tidak boleh melihat UI pembelian/keranjang.

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? '');
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (isAdmin) return;
    if (product.stock === 0) return;

    const user = sessionStore.get();
    if (!user || user.role !== 'customer') {
      showToast('Silakan login/daftar terlebih dahulu untuk menambahkan ke keranjang.', 'warning');
      return;
    }

    setAdding(true);
    cartStore.add(product.id, qty, selectedVariant);
    window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
    showToast(`${product.name} (${qty}x) ditambahkan ke keranjang! 🛍️`, 'success');
    setTimeout(() => {
      setAdding(false);
      onClose();
    }, 700);
  };

  const handleUpdateStock = () => {
    const input = window.prompt(
      `Update stok untuk "${product.name}". Masukkan angka stok baru:`,
      String(product.stock)
    );
    if (input === null) return;
    const next = Number(input);
    if (!Number.isFinite(next) || next < 0) {
      showToast('Nilai stok tidak valid.', 'warning');
      return;
    }
    productStore.update({ ...product, stock: Math.floor(next) });
    showToast(`Stok diperbarui: ${Math.floor(next)} untuk "${product.name}"`, 'success');
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-rose-xl animate-fade-scale scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden bg-secondary">
            <AppImage
              src={product.image}
              alt={`${product.name} — ${product.category} Vitalis Beauty, detail produk`}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 badge badge-primary font-bold">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 badge bg-red-500 text-white font-bold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                  {product.category}
                </p>
                <h2 className="text-xl font-extrabold text-foreground leading-tight">
                  {product.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
              >
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-muted-foreground">({product.reviewCount} ulasan)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-foreground">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2">
                  Ukuran
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        selectedVariant === v
                          ? 'border-primary bg-secondary text-primary'
                          : 'border-border text-muted-foreground hover:border-primary'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stok */}
            <div
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${
                product.stock === 0
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : product.stock < 10
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-green-50 text-green-600 border border-green-200'
              }`}
            >
              <Icon name={product.stock === 0 ? 'XCircleIcon' : 'CheckCircleIcon'} size={14} />
              {product.stock === 0
                ? 'Stok Habis'
                : product.stock < 10
                  ? `Sisa ${product.stock} stok`
                  : `Stok tersedia (${product.stock})`}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                  Jumlah:
                </p>
                <div className="flex items-center rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Icon name="MinusIcon" size={14} className="text-foreground" />
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-foreground min-w-[40px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Icon name="PlusIcon" size={14} className="text-foreground" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={isAdmin ? handleUpdateStock : handleAdd}
              disabled={!isAdmin ? adding || product.stock === 0 : product.stock === 0}
              className={`btn-primary w-full justify-center py-3.5 text-sm mt-auto disabled:opacity-60 ${
                isAdmin ? 'opacity-100' : ''
              }`}
            >
              {isAdmin ? (
                product.stock === 0 ? (
                  'Stok Habis'
                ) : (
                  'Update Stok'
                )
              ) : adding ? (
                <>
                  <Icon name="CheckIcon" size={16} /> Ditambahkan!
                </>
              ) : product.stock === 0 ? (
                'Stok Habis'
              ) : (
                <>
                  <Icon name="ShoppingBagIcon" size={16} /> Tambah ke Keranjang —{' '}
                  {formatRupiah(product.price * qty)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ingredients */}
        {product.ingredients && (
          <div className="px-6 pb-6 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Komposisi
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{product.ingredients}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────
function ProductCard({
  product,
  onDetail,
  index,
  isAdmin,
}: {
  product: Product;
  onDetail: (p: Product) => void;
  index: number;
  isAdmin: boolean;
}) {
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin) return;
    if (product.stock === 0) return;

    const user = sessionStore.get();
    if (!user || user.role !== 'customer') {
      showToast('Silakan login terlebih dahulu untuk menambahkan ke keranjang.', 'warning');
      return;
    }

    setAdding(true);
    cartStore.add(product.id, 1);
    window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
    showToast(`${product.name} ditambahkan ke keranjang! 🛍️`, 'success');
    setTimeout(() => setAdding(false), 800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="product-card group cursor-pointer flex flex-col"
      onClick={() => onDetail(product)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-secondary">
        <AppImage
          src={product.image}
          alt={`${product.name} — ${product.category} Vitalis Beauty`}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
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

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="badge bg-foreground text-white text-xs font-bold px-4 py-2">
              Stok Habis
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          {isAdmin ? (
            <button
              onClick={() => {
                const input = window.prompt(
                  `Update stok untuk "${product.name}". Masukkan angka stok baru:`,
                  String(product.stock)
                );
                if (input === null) return;
                const next = Number(input);
                if (!Number.isFinite(next) || next < 0) {
                  showToast('Nilai stok tidak valid.', 'warning');
                  return;
                }
                productStore.update({ ...product, stock: Math.floor(next) });
                showToast(
                  `Stok diperbarui: ${Math.floor(next)} untuk "${product.name}"`,
                  'success'
                );
                setTimeout(() => setAdding(false), 100);
              }}
              disabled={product.stock === 0}
              className="btn-primary text-xs py-2.5 px-5 shadow-rose-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-60"
            >
              <>
                <Icon name="PencilSquareIcon" size={13} /> Update Stok
              </>
            </button>
          ) : (
            <button
              onClick={() => handleAdd({ stopPropagation() {} } as any)}
              disabled={adding || product.stock === 0}
              className="btn-primary text-xs py-2.5 px-5 shadow-rose-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-60"
            >
              {adding ? (
                <>
                  <Icon name="CheckIcon" size={13} /> Ditambahkan
                </>
              ) : (
                <>
                  <Icon name="ShoppingBagIcon" size={13} /> Tambah Keranjang
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <div>
            <p className="text-base font-extrabold text-foreground">
              {formatRupiah(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatRupiah(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (isAdmin) {
                const input = window.prompt(
                  `Update stok untuk "${product.name}". Masukkan angka stok baru:`,
                  String(product.stock)
                );
                if (input === null) return;
                const next = Number(input);
                if (!Number.isFinite(next) || next < 0) {
                  showToast('Nilai stok tidak valid.', 'warning');
                  return;
                }
                productStore.update({ ...product, stock: Math.floor(next) });
                showToast(
                  `Stok diperbarui: ${Math.floor(next)} untuk "${product.name}"`,
                  'success'
                );
                return;
              }
              handleAdd({ stopPropagation() {} } as any);
            }}
            disabled={product.stock === 0 || isAdmin}
            className={`w-9 h-9 rounded-xl gradient-pink flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 disabled:opacity-40 ${
              isAdmin ? 'opacity-60' : ''
            }`}
            aria-label={
              isAdmin ? `Update stok ${product.name}` : `Tambah ${product.name} ke keranjang`
            }
          >
            <Icon
              name={isAdmin ? 'PencilSquareIcon' : adding ? 'CheckIcon' : 'PlusIcon'}
              size={16}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Catalog Page ─────────────────────────────────
const CATEGORIES = ['Semua', 'Eau de Parfum', 'Body Wash', 'Body Scent', 'Deodorant'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Terpopuler' },
  { value: 'price_asc', label: 'Harga: Terendah' },
  { value: 'price_desc', label: 'Harga: Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'newest', label: 'Terbaru' },
];

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [sort, setSort] = useState('popular');
  const [priceMax, setPriceMax] = useState(200000);
  const [minRating, setMinRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      console.log("DATA API:", data);

      // Jika API mengembalikan array langsung
      if (Array.isArray(data)) {
        setProducts(data);
      }
      // Jika API mengembalikan { success: true, data: [...] }
      else if (Array.isArray(data.data)) {
        setProducts(data.data);
      }
      // Fallback
      else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      setProducts([]);
    }
  };

  const u = sessionStore.get();
  setIsAdmin(!!u && u.role === "admin");

  loadProducts();
}, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (category !== 'Semua') list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price <= priceMax);

  switch (sort) {
  case 'price_asc':
    list.sort((a, b) => Number(a.price) - Number(b.price));
    break;

  case 'price_desc':
    list.sort((a, b) => Number(b.price) - Number(a.price));
    break;

  default:
    list.sort((a, b) => a.id - b.id);
}
    return list;
  }, [products, search, category, sort, priceMax, minRating]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCategory('Semua');
    setSort('popular');
    setPriceMax(200000);
    setMinRating(0);
  }, []);

  return (
    <>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isAdmin={isAdmin}
        />
      )}

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-card shadow-rose-xl p-6 overflow-y-auto animate-slide-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-extrabold text-foreground">Filter Produk</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-2 rounded-full hover:bg-muted"
              >
                <Icon name="XMarkIcon" size={18} className="text-foreground" />
              </button>
            </div>
            <FilterPanel
              category={category}
              setCategory={setCategory}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={resetFilters}
              onApply={() => setFilterOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="bg-background">
        {/* Page header */}
        <div className="gradient-hero py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 blob-primary animate-float opacity-50 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
              <Icon name="ChevronRightIcon" size={12} />
              <span className="text-foreground font-semibold">Katalog Produk</span>
            </nav>
            <h1 className="text-hero-md font-extrabold text-foreground tracking-tight mb-2">
              Katalog{' '}
              <span
                className="text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  backgroundImage: 'linear-gradient(135deg, #D4778A, #C9956D)',
                }}
              >
                Produk
              </span>
            </h1>
            <p className="text-muted-foreground font-light">{filtered.length} produk ditemukan</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-8">
            {/* Sidebar filter — desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="glass-card rounded-3xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                    Filter
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Reset
                  </button>
                </div>
                <FilterPanel
                  category={category}
                  setCategory={setCategory}
                  priceMax={priceMax}
                  setPriceMax={setPriceMax}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  onReset={resetFilters}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Search + sort bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari produk parfum, body wash..."
                    className="input-field pl-10"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input-field w-auto pr-8 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setFilterOpen(true)}
                    className="lg:hidden btn-secondary py-2.5 px-4 text-sm flex-shrink-0"
                  >
                    <Icon name="AdjustmentsHorizontalIcon" size={16} />
                    Filter
                  </button>
                </div>
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      category === cat
                        ? 'gradient-pink text-white shadow-rose-sm'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* BENTO GRID — 8 products with mixed sizes */}
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Icon name="MagnifyingGlassIcon" size={28} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    Produk tidak ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coba ubah filter atau kata kunci pencarian
                  </p>
                  <button onClick={resetFilters} className="btn-primary text-sm py-2.5 px-6">
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((product, i) => {
                    // Card 5 (index 4) spans 2 cols on large screens — FreshDazzle wide card
                    const isWide = product.id === 'prod_005' && filtered.length >= 5;
                    return (
                      <div key={product.id} className={isWide ? 'sm:col-span-2 lg:col-span-2' : ''}>
                        {isWide ? (
                          <WideProductCard
                            product={product}
                            onDetail={setSelectedProduct}
                            index={i}
                            isAdmin={isAdmin}
                          />
                        ) : (
                          <ProductCard
                            product={product}
                            onDetail={setSelectedProduct}
                            index={i}
                            isAdmin={isAdmin}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Filter Panel ──────────────────────────────────────
function FilterPanel({
  category,
  setCategory,
  priceMax,
  setPriceMax,
  minRating,
  setMinRating,
  onReset,
  onApply,
}: {
  category: string;
  setCategory: (c: string) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  onReset: () => void;
  onApply?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Kategori
        </p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                category === cat
                  ? 'bg-secondary text-primary font-bold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {category === cat && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Harga Maksimal
        </p>
        <input
          type="range"
          min={20000}
          max={200000}
          step={5000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Rp 20.000</span>
          <span className="font-bold text-primary">{formatRupiah(priceMax)}</span>
        </div>
      </div>

      {/* Min rating */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Rating Minimum
        </p>
        <div className="flex gap-2 flex-wrap">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                minRating === r
                  ? 'gradient-pink text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === 0 ? 'Semua' : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      {onApply && (
        <button onClick={onApply} className="btn-primary w-full justify-center py-3 text-sm">
          Terapkan Filter
        </button>
      )}
    </div>
  );
}

// ── Wide Product Card (for bento effect) ─────────────
function WideProductCard({
  product,
  onDetail,
  index,
  isAdmin,
}: {
  product: Product;
  onDetail: (p: Product) => void;
  index: number;
  isAdmin: boolean;
}) {
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;

    const user = sessionStore.get();
    if (!user || user.role !== 'customer') {
      showToast('Silakan login terlebih dahulu untuk menambahkan ke keranjang.', 'warning');
      return;
    }

    setAdding(true);
    cartStore.add(product.id, 1);
    window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
    showToast(`${product.name} ditambahkan ke keranjang! 🛍️`, 'success');
    setTimeout(() => setAdding(false), 800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="product-card group cursor-pointer flex flex-col sm:flex-row h-full"
      onClick={() => onDetail(product)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative sm:w-56 aspect-square sm:aspect-auto overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none flex-shrink-0 bg-secondary">
        <AppImage
          src={product.image}
          alt={`${product.name} — ${product.category} Vitalis Beauty, wide card view`}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="badge badge-accent font-bold text-xs">{product.badge}</span>
          )}
          {discount > 0 && (
            <span className="badge bg-red-500 text-white font-bold text-xs">-{discount}%</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-5 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="text-base font-extrabold text-foreground leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={13} />
            <span className="text-xs text-muted-foreground">({product.reviewCount} ulasan)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-light">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-lg font-extrabold text-foreground">{formatRupiah(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatRupiah(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              if (isAdmin) {
                e.stopPropagation();
                const input = window.prompt(
                  `Update stok untuk "${product.name}". Masukkan angka stok baru:`,
                  String(product.stock)
                );
                if (input === null) return;
                const next = Number(input);
                if (!Number.isFinite(next) || next < 0) {
                  showToast('Nilai stok tidak valid.', 'warning');
                  return;
                }
                productStore.update({ ...product, stock: Math.floor(next) });
                showToast(
                  `Stok diperbarui: ${Math.floor(next)} untuk "${product.name}"`,
                  'success'
                );
                return;
              }
              e.stopPropagation();
              handleAdd({ stopPropagation() {} } as any);
            }}
            disabled={!isAdmin ? adding || product.stock === 0 : product.stock === 0}
            className="btn-primary text-xs py-2.5 px-5 disabled:opacity-60"
          >
            {isAdmin ? (
              'Update Stok'
            ) : adding ? (
              <>
                <Icon name="CheckIcon" size={14} /> Ditambahkan
              </>
            ) : (
              <>
                <Icon name="ShoppingBagIcon" size={14} /> Tambah
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
