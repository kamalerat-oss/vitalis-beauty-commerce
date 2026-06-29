'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import { formatRupiah, sessionStore } from '@/lib/localStorage';
import type { User } from '@/lib/localStorage';
import Icon from '@/components/ui/AppIcon';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<User | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    completed: 0,
    shipped: 0,
    pending: 0,
    customersCount: 0,
  });

  useEffect(() => {
    const u = sessionStore.get();
    if (!u || u.role !== 'admin') {
      router.replace('/sign-up-login');
      return;
    }
    setAdmin(u);

    const fetchStats = async () => {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setProducts(productsData);
      setStats({
        productsCount: productsData.length,
        ordersCount: ordersData.length,
        totalRevenue: ordersData
          .filter((o: any) => o.status !== 'pending')
          .reduce((s: number, o: any) => s + Number(o.total_price), 0),
        completed: ordersData.filter((o: any) => o.status === 'completed').length,
        shipped: ordersData.filter((o: any) => o.status === 'shipped').length,
        pending: ordersData.filter((o: any) => o.status === 'pending' || o.status === 'diproses').length,
        customersCount: usersData.count,
      });
    };

    fetchStats();
  }, [router]);

  if (!admin) {
    return (
      <>
        <StoreInitializer />
        <ToastProvider />
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Memuat dashboard...</div>
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Selamat datang, <span className="font-semibold text-foreground">{admin.name}</span>
              </p>
            </div>

            <div className="glass-card rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center text-white font-bold">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{admin.email}</p>
                  <p className="text-xs text-muted-foreground">Akses: Admin</p>
                </div>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Produk</div>
                <Icon name="CubeIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{stats.productsCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Total item katalog</div>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Pesanan</div>
                <Icon name="ReceiptPercentIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{stats.ordersCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Semua status</div>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Revenue</div>
                <Icon name="ChartBarIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {formatRupiah(stats.totalRevenue)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Akumulasi (non-pending)</div>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Customer</div>
                <Icon name="UserGroupIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{stats.customersCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Role: customer</div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="glass-card rounded-3xl p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-lg">Ringkasan Pesanan</h2>
                <div className="text-xs text-muted-foreground">Status saat ini</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-foreground">Completed</p>
                  </div>
                  <p className="text-2xl font-extrabold mt-2">{stats.completed}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <p className="text-sm font-semibold text-foreground">Shipped</p>
                  </div>
                  <p className="text-2xl font-extrabold mt-2">{stats.shipped}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-sm font-semibold text-foreground">Pending</p>
                  </div>
                  <p className="text-2xl font-extrabold mt-2">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5">
              <h2 className="font-extrabold text-lg mb-3">Aksi Cepat</h2>
              <div className="flex flex-col gap-3">
                <button
                  className="btn-secondary w-full justify-center"
                  onClick={() => router.push('/admin/products/new')}
                >
                  Tambah Produk
                </button>
                <button
                  className="btn-ghost w-full justify-center"
                  onClick={() => router.push('/admin/products')}
                >
                  Kelola Produk
                </button>
                <button
                  className="btn-ghost w-full justify-center"
                  onClick={() => router.push('/admin/orders')}
                >
                  Kelola Pesanan
                </button>
                <button
                  className="btn-primary w-full justify-center"
                  onClick={() => router.push('/admin/reports')}
                >
                  Lihat Laporan
                </button>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-3xl p-5">
            <h2 className="font-extrabold text-lg mb-3">Produk Terbaru</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((p) => (
                <div key={p.id} className="rounded-3xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-bold">{formatRupiah(p.price)}</p>
                        <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}