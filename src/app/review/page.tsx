'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import { showToast } from '@/lib/toast';

export default function ReviewPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oId = params.get('orderId');
    setOrderId(oId);
    try {
      const raw = localStorage.getItem('vitalis_current_user');
      const u = raw ? JSON.parse(raw) : null;
      if (!u) { router.replace('/sign-up-login'); return; }
      setUserId(String(u.id));
      if (oId) {
        fetch(`/api/orders/mine?userId=${u.id}`)
          .then(r => r.json())
          .then(data => {
            const order = (data.orders ?? []).find((o: any) => String(o.id) === oId);
            if (order) setItems((order.items ?? []).filter((i: any) => i.id));
          })
          .finally(() => setLoading(false));
      }
    } catch { router.replace('/sign-up-login'); }
  }, [router]);

  const handleSubmit = async (productId: number) => {
    if (!ratings[productId]) { showToast('Pilih rating dulu ya!', 'error'); return; }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, productId, userId,
          rating: ratings[productId],
          comment: comments[productId] || '',
        }),
      });
      const data = await res.json();
      if (!data.success) { showToast(data.message, 'error'); return; }
      setSubmitted(prev => ({ ...prev, [productId]: true }));
      showToast('Ulasan berhasil dikirim!', 'success');
    } catch { showToast('Gagal kirim ulasan.', 'error'); }
  };

  if (loading) return (
    <><ToastProvider /><Header />
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Memuat...</div>
      </div></>
  );

  return (
    <><ToastProvider /><Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold mb-2">Beri Ulasan</h1>
          <p className="text-sm text-muted-foreground mb-8">Bagikan pengalamanmu dengan produk yang kamu beli.</p>

          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.product_id} className="glass-card rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-muted" />}
                  <div>
                    <p className="font-extrabold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} item</p>
                  </div>
                </div>

                {submitted[item.product_id] ? (
                  <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700 font-medium text-center">
                    ✅ Ulasan kamu sudah terkirim, terima kasih!
                  </div>
                ) : (
                  <>
                    {/* Bintang */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Rating</p>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRatings(prev => ({ ...prev, [item.product_id]: star }))}
                            className="text-2xl transition-transform hover:scale-110"
                          >
                            {star <= (ratings[item.product_id] ?? 0) ? '⭐' : '☆'}
                          </button>
                        ))}
                        {ratings[item.product_id] && (
                          <span className="text-sm text-muted-foreground self-center ml-1">
                            {ratings[item.product_id]}/5
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Komentar */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Komentar (opsional)</p>
                      <textarea
                        className="input w-full min-h-[100px] resize-none"
                        placeholder="Bagaimana pendapatmu tentang produk ini?"
                        value={comments[item.product_id] ?? ''}
                        onChange={e => setComments(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                      />
                    </div>

                    <button
                      className="btn-primary w-full py-3"
                      onClick={() => handleSubmit(item.product_id)}
                    >
                      Kirim Ulasan
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          <button
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => router.push('/profile?tab=pesanan')}
          >
            ← Kembali ke Riwayat Pesanan
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
