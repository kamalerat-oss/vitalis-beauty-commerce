'use client';

import { useRouter } from 'next/navigation';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import ChatbotWidget from '@/components/ChatbotWidget';
import Icon from '@/components/ui/AppIcon';
import {
  cartStore,
  initializeStore,
  sessionStore,
  formatRupiah,
} from '@/lib/localStorage';
import { showToast } from '@/lib/toast';

type Address = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
};

const SHIPPING_COST = 15000;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState(cartStore.get());
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS');
  const [placing, setPlacing] = useState(false);

  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setAllProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const u = sessionStore.get();
    if (!u) {
      // Jika belum login, biarkan user mengisi checkout, lalu guard berlaku saat submit.
    } else if (u.role !== 'customer') {
      showToast('Silakan login/daftar terlebih dahulu sebagai customer untuk checkout.', 'warning');
      router.replace('/admin');
      return;
    }

    initializeStore();
    const handler = () => setItems(cartStore.get());
    window.addEventListener('vitalis-cart-update', handler);
    return () => window.removeEventListener('vitalis-cart-update', handler);
  }, []);

  const detailedItems = useMemo(() => {
    return items
      .map((i) => {
        const p = allProducts.find((p) => String(p.id) === String(i.productId));
        if (!p) return null;
        return {
          productId: i.productId,
          productName: p.name,
          price: p.price,
          quantity: i.quantity,
          image: p.image,
          variant: i.variant,
        };
      })
      .filter(Boolean) as Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      image: string;
      variant?: string;
    }>;
  }, [items, allProducts]);

  const subtotal = useMemo(
    () => detailedItems.reduce((s, i) => s + i.price * i.quantity, 0),
    [detailedItems]
  );
  const shipping = detailedItems.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const canPlace = useMemo(() => {
    if (detailedItems.length === 0) return false;
    if (!address.fullName.trim()) return false;
    if (!address.phone.trim()) return false;
    if (!address.street.trim()) return false;
    if (!address.city.trim()) return false;
    if (!address.province.trim()) return false;
    if (!address.postalCode.trim()) return false;
    return true;
  }, [address, detailedItems.length]);

  const placeOrder = async () => {
    const user = sessionStore.get();
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk melakukan checkout.', 'warning');
      return;
    }
    if (!user.email || !user.email.includes('@')) {
      showToast('Email akun kamu tidak valid. Invoice tidak dapat dikirim.', 'warning');
      return;
    }
    if (!canPlace) {
      showToast('Form checkout belum lengkap.', 'warning');
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          items: detailedItems.map((di) => ({
            productId: di.productId,
            productName: di.productName,
            price: di.price,
            quantity: di.quantity,
            image: di.image,
          })),
          subtotal,
          shipping,
          total,
          address,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Gagal membuat pesanan, coba lagi.', 'error');
        return;
      }

      cartStore.clear();
      window.dispatchEvent(new CustomEvent('vitalis-cart-update'));
      showToast(`Order berhasil dibuat! #${data.orderId}`, 'success');
      router.push(`/payment/${data.orderId}`);
    } catch {
      showToast('Gagal membuat pesanan, coba lagi.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <StoreInitializer />
      <ToastProvider />
      <Header />

      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-foreground">Checkout</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lengkapi alamat dan pilih metode pembayaran.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="TruckIcon" size={14} /> Pengiriman
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="inline-flex items-center gap-1">
                    <Icon name="ShieldCheckIcon" size={14} /> Aman
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="glass-card rounded-3xl p-6 mb-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary mb-4">
                  Alamat Pengiriman
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Nama Lengkap
                    </span>
                    <input
                      className="input-field"
                      value={address.fullName}
                      onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Nomor Telepon
                    </span>
                    <input
                      className="input-field"
                      value={address.phone}
                      onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground">Alamat</span>
                    <input
                      className="input-field"
                      value={address.street}
                      onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Kota</span>
                    <input
                      className="input-field"
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Provinsi</span>
                    <input
                      className="input-field"
                      value={address.province}
                      onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))}
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground">Kode Pos</span>
                    <input
                      className="input-field"
                      value={address.postalCode}
                      onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                    />
                  </label>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary mb-4">
                  Metode Pembayaran
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  {['QRIS', 'Bank Transfer', 'E-Wallet'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`btn-secondary py-3.5 px-5 ${paymentMethod === m ? 'bg-primary text-primary-foreground border-primary' : ''}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary mb-3">
                    Ringkasan Produk
                  </h2>

                  {detailedItems.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Keranjang kosong.</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {detailedItems.map((di) => (
                        <div
                          key={`${di.productId}_${di.variant ?? ''}`}
                          className="flex items-center gap-3 border border-border rounded-2xl bg-card p-3"
                        >
                          <img
                            src={di.image}
                            alt={di.productName}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold truncate">{di.productName}</p>
                            {di.variant && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Varian: {di.variant}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatRupiah(di.price)} × {di.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-extrabold">
                            {formatRupiah(di.price * di.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="lg:col-span-1">
              <div className="glass-card rounded-3xl p-6 sticky top-24">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary mb-4">
                  Total
                </h2>

                <div className="flex justify-between text-sm text-muted-foreground mb-3">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-3">
                  <span>Ongkir</span>
                  <span className="font-bold text-foreground">{formatRupiah(shipping)}</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-base font-extrabold">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={!canPlace || placing}
                  className="btn-primary w-full justify-center py-3.5 mt-6 disabled:opacity-60"
                >
                  {placing ? (
                    <span className="inline-flex items-center gap-2">
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> Memproses...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Icon name="CheckIcon" size={16} /> Lanjut ke Pembayaran
                    </span>
                  )}
                </button>

                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  Dengan membuat pesanan, Anda setuju dengan proses pembayaran dan pengiriman.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <ChatbotWidget />
    </>
  );
}
