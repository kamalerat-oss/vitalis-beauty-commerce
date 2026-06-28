'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import Icon from '@/components/ui/AppIcon';
import { showToast } from '@/lib/toast';

function formatRupiah(n: number) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700' },
  diproses:  { label: 'Diproses',            color: 'bg-blue-100 text-blue-700' },
  dikirim:   { label: 'Dikirim',             color: 'bg-purple-100 text-purple-700' },
  selesai:   { label: 'Selesai',             color: 'bg-green-100 text-green-700' },
  completed: { label: 'Selesai',             color: 'bg-green-100 text-green-700' },
  shipped:   { label: 'Dikirim',             color: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Dibatalkan',          color: 'bg-red-100 text-red-700' },
};

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<'profil' | 'pesanan'>('profil');
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersFetched, setOrdersFetched] = useState(false);
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'pesanan') setTab('pesanan');
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vitalis_current_user');
      const u = raw ? JSON.parse(raw) : null;
      if (!u) { router.replace('/sign-up-login'); return; }
      setUserId(String(u.id));
      fetch(`/api/profile?userId=${u.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
            setFullname(data.user.fullname);
            setPhone(data.user.phone || '');
          }
        });
    } catch { router.replace('/sign-up-login'); }
  }, [router]);

  useEffect(() => {
    if (tab === 'pesanan' && userId && !ordersFetched) {
      setLoadingOrders(true);
      fetch(`/api/orders/mine?userId=${userId}`)
        .then(r => r.json())
        .then(data => { if (data.success) setOrders(data.orders); })
        .finally(() => { setLoadingOrders(false); setOrdersFetched(true); });
    }
  }, [tab, userId, ordersFetched]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fullname, phone, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined }),
      });
      const data = await res.json();
      if (!data.success) { showToast(data.message, 'error'); return; }
      const raw = localStorage.getItem('vitalis_current_user');
      const u = raw ? JSON.parse(raw) : {};
      localStorage.setItem('vitalis_current_user', JSON.stringify({ ...u, name: data.user.fullname, phone: data.user.phone }));
      setUser(data.user);
      setCurrentPassword(''); setNewPassword('');
      showToast('Profil berhasil diperbarui!', 'success');
    } catch { showToast('Gagal menyimpan profil.', 'error'); }
    finally { setSaving(false); }
  };

  if (!user) return (
    <><ToastProvider /><Header />
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Memuat profil...</div>
      </div></>
  );

  return (
    <><ToastProvider /><Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full gradient-pink flex items-center justify-center text-white text-2xl font-bold">
              {user.fullname?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{user.fullname}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b border-border">
            {(['profil', 'pesanan'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                  tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}>
                {t === 'profil' ? 'Profil Saya' : 'Riwayat Pesanan'}
              </button>
            ))}
          </div>

          {tab === 'profil' && (
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Lengkap</label>
                <input className="input w-full" value={fullname} onChange={e => setFullname(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
                <input className="input w-full bg-muted" value={user.email} disabled />
                <p className="text-xs text-muted-foreground mt-1">Email tidak bisa diubah.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nomor HP</label>
                <input className="input w-full" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
              </div>
              <div className="h-px bg-border my-2" />
              <p className="text-xs font-semibold text-muted-foreground">Ganti Password (opsional)</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Password Lama</label>
                <input type="password" className="input w-full" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Isi jika ingin ganti password" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Password Baru</label>
                <input type="password" className="input w-full" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Password baru" />
              </div>
              <button className="btn-primary py-3 mt-2" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          )}

          {tab === 'pesanan' && (
            <div className="flex flex-col gap-4">
              {loadingOrders ? (
                <div className="text-center py-12 text-sm text-muted-foreground">Memuat pesanan...</div>
              ) : orders.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <Icon name="ShoppingBagIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold">Belum ada pesanan</p>
                  <p className="text-sm text-muted-foreground mt-1">Yuk mulai belanja!</p>
                  <button className="btn-primary mt-4 px-6" onClick={() => router.push('/product-catalog')}>Lihat Produk</button>
                </div>
              ) : orders.map((order) => {
                const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-muted text-foreground' };
                const isSelesai = order.status === 'completed' || order.status === 'selesai';
                return (
                  <div key={order.id} className="glass-card rounded-3xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-extrabold text-sm">{order.invoice_number ?? `INV-${order.id}`}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    </div>
                    <div className="flex flex-col gap-2 mb-3">
                      {(order.items ?? []).filter((i: any) => i.id).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.quantity}x {formatRupiah(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-extrabold">{formatRupiah(order.total_price)}</p>
                    </div>

                    {/* Status info */}
                    {(order.status === 'dikirim' || order.status === 'shipped') && (
                      <div className="mt-3 bg-purple-50 rounded-xl px-4 py-2 text-xs text-purple-700 font-medium">📦 Pesanan kamu sedang dalam perjalanan!</div>
                    )}
                    {order.status === 'diproses' && (
                      <div className="mt-3 bg-blue-50 rounded-xl px-4 py-2 text-xs text-blue-700 font-medium">⚙️ Pesanan kamu sedang diproses oleh tim kami.</div>
                    )}
                    {order.status === 'pending' && (
                      <div className="mt-3 bg-yellow-50 rounded-xl px-4 py-2 text-xs text-yellow-700 font-medium">⏳ Menunggu konfirmasi pembayaran.</div>
                    )}

                    {/* Tombol Beri Ulasan */}
                    {isSelesai && (
                      <button
                        className="mt-3 w-full btn-secondary py-2.5 text-sm font-semibold"
                        onClick={() => router.push(`/review?orderId=${order.id}`)}
                      >
                        ⭐ Beri Ulasan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
