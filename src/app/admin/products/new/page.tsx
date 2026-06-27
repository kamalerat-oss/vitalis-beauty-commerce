'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import Icon from '@/components/ui/AppIcon';
import { formatRupiah, sessionStore } from '@/lib/localStorage';
import { showToast } from '@/lib/toast';

function isAdminUser() {
  const u = sessionStore.get();
  return !!u && u.role === 'admin';
}

export default function AdminProductsNewPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [id, setId] = useState<string | null>(null);

  const [adminOk, setAdminOk] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    // Parse query params in the browser only.
    try {
      const sp = new URLSearchParams(window.location.search);
      const nextMode = (sp.get('mode') || 'add') as 'add' | 'edit';
      const nextId = sp.get('id');
      setMode(nextMode);
      setId(nextId);
    } catch {
      // ignore
    }

    if (!isAdminUser()) {
      router.replace('/admin');
      return;
    }
    setAdminOk(true);
  }, [router]);

  useEffect(() => {
    if (!adminOk) return;
    if (mode === 'edit' && id) {
      setLoadingProduct(true);
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((p) => {
          if (!p || p.success === false) {
            showToast('Produk tidak ditemukan.', 'error');
            router.push('/admin/products');
            return;
          }
          setName(p.name ?? '');
          setCategory(p.category ?? '');
          setPrice(String(p.price ?? ''));
          setStock(String(p.stock ?? ''));
          setDescription(p.description ?? '');
          setImage(p.image ?? '');
        })
        .catch(() => {
          showToast('Gagal memuat data produk.', 'error');
        })
        .finally(() => setLoadingProduct(false));
    }
  }, [adminOk, id, mode, router]);

  const canSave = useMemo(() => {
    if (!name.trim()) return false;
    if (!category.trim()) return false;
    if (!price.trim()) return false;
    if (!stock.trim()) return false;
    if (!description.trim()) return false;
    if (!image.trim()) return false;
    const p = Number(price);
    const s = Number(stock);
    if (!Number.isFinite(p) || p < 0) return false;
    if (!Number.isFinite(s) || s < 0) return false;
    return true;
  }, [name, category, price, stock, description, image]);

  const handleSubmit = async () => {
    if (!canSave) {
      showToast('Form belum lengkap.', 'warning');
      return;
    }

    const p = Math.floor(Number(price));
    const s = Math.floor(Number(stock));

    setSaving(true);
    try {
      if (mode === 'edit' && id) {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            category: category.trim(),
            price: p,
            stock: s,
            description: description.trim(),
            image: image.trim(),
          }),
        });
        const data = await res.json();
        if (!data.success) {
          showToast(data.message || 'Gagal menyimpan perubahan.', 'error');
          return;
        }
        showToast('Produk diperbarui.', 'success');
        router.push('/admin/products');
        return;
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          price: p,
          stock: s,
          description: description.trim(),
          image: image.trim(),
          badge: 'New',
          isNew: true,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Gagal menambahkan produk.', 'error');
        return;
      }
      showToast('Produk ditambahkan.', 'success');
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan, coba lagi.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!adminOk || loadingProduct) {
    return (
      <>
        <StoreInitializer />
        <ToastProvider />
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Memuat halaman...</div>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {mode === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Isi data produk. Data disimpan ke database.
            </p>
          </div>

          <section className="glass-card rounded-3xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Nama produk</span>
                <input
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Kategori</span>
                <input
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Harga</span>
                <input
                  className="input-field"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="numeric"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Stok</span>
                <input
                  className="input-field"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  inputMode="numeric"
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold text-muted-foreground">Deskripsi</span>
                <textarea
                  className="input-field min-h-[110px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Gambar produk (URL)
                </span>
                <input
                  className="input-field"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                className="btn-primary w-full justify-center"
                onClick={handleSubmit}
                disabled={!canSave || saving}
              >
                <Icon name="CheckIcon" size={16} />{' '}
                {saving ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
              <button
                className="btn-ghost w-full justify-center"
                onClick={() => router.push('/admin/products')}
              >
                Batal
              </button>
            </div>

            <div className="text-xs text-muted-foreground mt-4">
              Preview harga: {price.trim() ? formatRupiah(Number(price)) : '—'}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
