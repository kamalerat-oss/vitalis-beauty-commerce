'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import Icon from '@/components/ui/AppIcon';
import { formatRupiah, sessionStore } from '@/lib/localStorage';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Diproses' },
  { value: 'shipped', label: 'Dikirim' },
  { value: 'completed', label: 'Selesai' },
] as const;

export default function AdminOrdersPage() {
  const router = useRouter();
  const [adminOk, setAdminOk] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    const u = sessionStore.get();
    if (!u || u.role !== 'admin') {
      router.replace('/admin');
      return;
    }
    setAdminOk(true);
    fetchOrders();
  }, [router]);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      console.error('Gagal update status');
    }
  };

  const grouped = useMemo(() => ({
    pending: orders.filter((o) => o.status === 'pending').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  }), [orders]);

  if (!adminOk) {
    return (
      <>
        <StoreInitializer />
        <ToastProvider />
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Memuat pesanan admin...</div>
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pesanan</h1>
              <p className="text-sm text-muted-foreground mt-1">Kelola status pesanan customer.</p>
            </div>
            <div className="glass-card rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center text-white font-bold">
                  <Icon name="ReceiptPercentIcon" size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{orders.length} Pesanan</p>
                  <p className="text-xs text-muted-foreground">Pending: {grouped.pending}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="glass-card rounded-3xl p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-3 px-2 font-semibold">Customer</th>
                    <th className="py-3 px-2 font-semibold">Produk</th>
                    <th className="py-3 px-2 font-semibold">Total</th>
                    <th className="py-3 px-2 font-semibold">Status</th>
                    <th className="py-3 px-2 font-semibold">Tanggal</th>
                    <th className="py-3 px-2 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-border/60">
                      <td className="py-4 px-2">
                        <div className="font-extrabold">{o.user_name ?? `User #${o.user_id}`}</div>
                        <div className="text-xs text-muted-foreground">{o.user_email}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-xs text-muted-foreground">
                          {(o.items ?? []).map((it: any, idx: number) => (
                            <span key={idx} className="block">
                              {it.name} × {it.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-2 font-bold">{formatRupiah(o.total_price)}</td>
                      <td className="py-4 px-2">
                        <span className="badge bg-muted">{o.status}</span>
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-4 px-2">
                        <select
                          className="input-field text-sm"
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        Belum ada pesanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}