'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cartStore, formatRupiah } from '@/lib/localStorage';
import type { CartItem, Product } from '@/lib/localStorage';

interface CartDetailItem extends CartItem {
  product?: Product;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartDetailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = cartStore.get();
      if (cartItems.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/products');
        const allProducts: Product[] = await res.json();
        const detailed = cartItems.map((item) => ({
          ...item,
          product: allProducts.find((p) => String(p.id) === String(item.productId)),
        }));
        setItems(detailed);
      } catch {
        setItems(cartItems.map((item) => ({ ...item, product: undefined })));
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleRemove = (productId: string, variant?: string) => {
    cartStore.remove(productId, variant);
    setItems((prev) =>
      prev.filter((i) => !(String(i.productId) === String(productId) && i.variant === variant))
    );
    window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
  };

  const handleQty = (productId: string, qty: number, variant?: string) => {
    if (qty < 1) return;
    cartStore.updateQty(productId, qty, variant);
    setItems((prev) =>
      prev.map((i) =>
        String(i.productId) === String(productId) && i.variant === variant
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 block">
            Belanja
          </span>
          <h1 className="text-3xl font-extrabold text-foreground">Keranjang Belanja</h1>
          <p className="text-muted-foreground mt-1">Produk yang telah kamu pilih</p>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-border bg-secondary/30 py-20 flex flex-col items-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Keranjang Masih Kosong</h2>
            <p className="text-muted-foreground mb-6">Yuk pilih produk favoritmu dulu.</p>
            <button
              onClick={() => router.push('/product-catalog')}
              className="px-8 py-3 rounded-full font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #D4778A, #C9956D)' }}
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-white p-4 flex gap-4 items-center shadow-sm"
                >
                  {/* Product image placeholder */}
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-secondary flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {item.product?.category}
                    </p>
                    <h3 className="font-bold text-foreground text-sm leading-tight mt-0.5 line-clamp-2">
                      {item.product?.name ?? `Produk #${item.productId}`}
                    </h3>
                    {item.variant && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground mt-1 inline-block">
                        {item.variant}
                      </span>
                    )}

                    {/* Qty control */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQty(item.productId, item.quantity - 1, item.variant)}
                        className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQty(item.productId, item.quantity + 1, item.variant)}
                        className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="font-extrabold text-foreground text-sm">
                      {formatRupiah((item.product?.price || 0) * item.quantity)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.productId, item.variant)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sticky top-24">
                <h2 className="font-bold text-lg text-foreground mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} produk)</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Ongkos Kirim</span>
                    <span className="text-green-500 font-semibold">Dihitung saat checkout</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-extrabold text-foreground text-base">
                    <span>Total</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="mt-6 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #D4778A, #C9956D)' }}
                >
                  Lanjut Checkout →
                </button>

                <button
                  onClick={() => router.push('/product-catalog')}
                  className="mt-3 w-full py-3 rounded-xl font-semibold text-sm text-muted-foreground border border-border hover:bg-secondary transition-colors"
                >
                  Lanjut Belanja
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}