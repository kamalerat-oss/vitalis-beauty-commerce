'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import Icon from '@/components/ui/AppIcon';
import { sessionStore, formatRupiah } from '@/lib/localStorage';
import { showToast } from '@/lib/toast';

type DbProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

function isAdminUser() {
  const u = sessionStore.get();
  return !!u && u.role === 'admin';
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [adminOk, setAdminOk] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat produk dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminUser()) {
      router.replace('/admin');
      return;
    }
    setAdminOk(true);
    fetchProducts();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini? Tindakan ini tidak bisa dibatalkan.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Gagal menghapus produk.', 'error');
        return;
      }
      showToast('Produk dihapus.', 'success');
      fetchProducts();
      window.dispatchEvent(new CustomEvent('vitalis-products-update'));
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus produk.', 'error');
    }
  };

  const handleUpdateStock = async (id: number) => {
    const p = products.find((item) => item.id === id);
    if (!p) return;
    const input = window.prompt(
      `Update stok untuk "${p.name}". Masukkan angka stok baru:`,
      String(p.stock)
    );
    if (input === null) return;
    const next = Number(input);
    if (!Number.isFinite(next) || next < 0) {
      showToast('Nilai stok tidak valid.', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Math.floor(next) }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Gagal update stok.', 'error');
        return;
      }
      showToast(`Stok diperbarui: ${Math.floor(next)}`, 'success');
      fetchProducts();
    } catch (error) {
      console.error(error);
      showToast('Gagal update stok.', 'error');
    }
  };

  const headerStats = useMemo(() => {
    return {
      total: products.length,
    };
  }, [products.length]);

  if (!adminOk || loading) {
    return (
      <>
        <StoreInitializer />
        <ToastProvider />
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Memuat halaman admin...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <StoreInitializer />
      <ToastProvider />
      <Header />

      <main className="min-h-screen pt-24 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Kelola Produk</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Total produk:{' '}
                <span className="font-semibold text-foreground">{headerStats.total}</span>
              </p>
            </div>

            <button className="btn-primary" onClick={() => router.push('/admin/products/new')}>
              <Icon name="PlusIcon" size={16} className="-ml-0.5" /> Tambah Produk
            </button>
          </div>

          <section className="glass-card rounded-3xl p-5 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-3 px-2 font-semibold">Produk</th>
                    <th className="py-3 px-2 font-semibold">Kategori</th>
                    <th className="py-3 px-2 font-semibold">Harga</th>
                    <th className="py-3 px-2 font-semibold">Stok</th>
                    <th className="py-3 px-2 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-border/60">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold truncate">{p.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">{p.category}</td>
                      <td className="py-4 px-2 font-bold">{formatRupiah(p.price)}</td>
                      <td className="py-4 px-2 text-muted-foreground">{p.stock}</td>
                      <td className="py-4 px-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="btn-secondary text-xs py-2"
                            onClick={() => router.push('/admin/products/new?mode=edit&id=' + p.id)}
                          >
                            <Icon name="PencilSquareIcon" size={14} /> Edit
                          </button>
                          <button
                            className="btn-ghost text-xs py-2 text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Icon name="TrashIcon" size={14} /> Hapus
                          </button>
                          <button
                            className="btn-ghost text-xs py-2"
                            onClick={() => handleUpdateStock(p.id)}
                          >
                            <Icon name="CubeIcon" size={14} /> Update Stok
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-xs text-muted-foreground">
            Data tersimpan di database (PostgreSQL / Supabase).
          </p>
        </div>
      </main>
    </>
  );
}
