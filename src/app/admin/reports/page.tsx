'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ToastProvider from '@/components/ToastProvider';
import Icon from '@/components/ui/AppIcon';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

interface Order {
  id: number;
  invoice_number: string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi admin dari localStorage (sama seperti halaman admin lainnya)
    try {
      const raw = localStorage.getItem('vitalis_current_user');
      const user = raw ? JSON.parse(raw) : null;
      if (!user || user.role !== 'admin') {
        router.replace('/admin');
        return;
      }
    } catch {
      router.replace('/admin');
      return;
    }
    setReady(true);

    async function load() {
      const [ordRes, usrRes] = await Promise.all([
        fetch('/api/orders').catch(() => null),
        fetch('/api/users').catch(() => null),
      ]);
      const ordData = ordRes?.ok ? await ordRes.json() : {};
      const usrData = usrRes?.ok ? await usrRes.json() : { count: 0 };

      const allOrders: Order[] = ordData.orders ?? ordData ?? [];
      setOrders(allOrders);
      setCustomerCount(usrData.count ?? 0);
      setLoading(false);
    }
    load();
  }, [router]);

  const completed = orders.filter((o) => o.status === 'completed');
  const revenue = completed.reduce((s, o) => s + Number(o.total_price), 0);
  const transactions = orders
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  if (!ready) return null;

  return (
    <>
      <ToastProvider />
      <Header />
      <main className="min-h-screen pt-24 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Laporan Penjualan</h1>
              <p className="text-sm text-muted-foreground mt-1">Ringkasan transaksi dari database.</p>
            </div>
            <div className="glass-card rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center text-white">
                  <Icon name="ChartBarIcon" size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Revenue</p>
                  <p className="text-xs text-muted-foreground">{formatRupiah(revenue)}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Revenue</div>
                <Icon name="ChartBarIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold">{formatRupiah(revenue)}</div>
              <div className="text-xs text-muted-foreground mt-1">Akumulasi pesanan selesai</div>
            </div>
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Pesanan Selesai</div>
                <Icon name="ReceiptPercentIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold">{completed.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Status: completed</div>
            </div>
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Total Pesanan</div>
                <Icon name="CubeIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold">{orders.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Semua status</div>
            </div>
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-muted-foreground">Total Customer</div>
                <Icon name="UserGroupIcon" size={18} className="text-muted-foreground" />
              </div>
              <div className="text-3xl font-extrabold">{customerCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Role: customer</div>
            </div>
          </section>

          <section className="glass-card rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-lg">Transaksi Terbaru</h2>
              <div className="text-xs text-muted-foreground">Menampilkan 10 transaksi terbaru</div>
            </div>
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Memuat data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-3 px-2 font-semibold">Invoice</th>
                      <th className="py-3 px-2 font-semibold">Customer</th>
                      <th className="py-3 px-2 font-semibold">Total</th>
                      <th className="py-3 px-2 font-semibold">Status</th>
                      <th className="py-3 px-2 font-semibold">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id} className="border-t border-border/60">
                        <td className="py-4 px-2 font-semibold">{t.invoice_number ?? `INV-${t.id}`}</td>
                        <td className="py-4 px-2 text-muted-foreground">{t.customer_name ?? '-'}</td>
                        <td className="py-4 px-2 font-bold">{formatRupiah(Number(t.total_price))}</td>
                        <td className="py-4 px-2">
                          <span className="badge bg-muted">{t.status}</span>
                        </td>
                        <td className="py-4 px-2 text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                          Belum ada transaksi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
