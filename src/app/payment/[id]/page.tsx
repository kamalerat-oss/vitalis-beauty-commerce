'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import StoreInitializer from '@/app/components/StoreInitializer';
import Icon from '@/components/ui/AppIcon';
import { formatRupiah } from '@/lib/localStorage';
import { showToast } from '@/lib/toast';
import { generateInvoicePdf } from '@/lib/generateInvoicePdf';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderDetail = {
  id: number;
  total_price: number;
  payment_method: string;
  status: string;
  customer_name: string;
  customer_email: string;
  subtotal: number;
  shipping_cost: number;
  created_at: string;
  paid_at: string | null;
  shipping_address?: { street?: string; city?: string; province?: string; postalCode?: string } | string;
  items?: OrderItem[];
};

const BANK_DETAILS: Record<string, { number: string; name: string }> = {
  BCA: { number: '8800-1234-5678', name: 'PT Vitalis Beauty Commerce' },
  BNI: { number: '0123-4567-89', name: 'PT Vitalis Beauty Commerce' },
  BRI: { number: '0098-7654-3210', name: 'PT Vitalis Beauty Commerce' },
  BTN: { number: '7711-2233-44', name: 'PT Vitalis Beauty Commerce' },
};

const EWALLET_DETAILS: Record<string, { number: string; name: string }> = {
  DANA: { number: '0812-3456-7890', name: 'Vitalis Beauty Commerce' },
  OVO: { number: '0812-3456-7890', name: 'Vitalis Beauty Commerce' },
  GoPay: { number: '0812-3456-7890', name: 'Vitalis Beauty Commerce' },
};

export default function PaymentPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const [selectedBank, setSelectedBank] = useState('BCA');
  const [selectedEwallet, setSelectedEwallet] = useState('DANA');

  useEffect(() => {
    try {
      const path = window.location.pathname;
      const segments = path.split('/');
      const id = segments[segments.length - 1];
      setOrderId(id);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders?orderId=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        const found = Array.isArray(data) ? data.find((o: any) => String(o.id) === String(orderId)) : null;
        if (found) {
          setOrder(found);
          if (found.status !== 'pending') {
            setDone(true);
          }
        } else {
          showToast('Pesanan tidak ditemukan.', 'error');
        }
      })
      .catch(() => showToast('Gagal memuat detail pesanan.', 'error'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleConfirmPayment = async () => {
    if (!orderId) return;
    setConfirming(true);
    try {
      // Untuk Bank Transfer / E-Wallet, kirim juga detail bank/e-wallet
      // spesifik yang dipilih user supaya tersimpan di catatan pembayaran.
      let detailLabel = order?.payment_method ?? '';
      if (order?.payment_method === 'Bank Transfer') {
        detailLabel = `Bank Transfer - ${selectedBank}`;
      } else if (order?.payment_method === 'E-Wallet') {
        detailLabel = `E-Wallet - ${selectedEwallet}`;
      }

      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentDetail: detailLabel }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Gagal mengonfirmasi pembayaran.', 'error');
        return;
      }

      setOrder((prev) => (prev ? { ...prev, payment_method: detailLabel } : prev));
      setDone(true);
      if (data.emailSent) {
        showToast('Pembayaran berhasil! Invoice telah dikirim ke email kamu.', 'success');
      } else {
        showToast('Pembayaran berhasil dikonfirmasi.', 'success');
      }
    } catch {
      showToast('Terjadi kesalahan, coba lagi.', 'error');
    } finally {
      setConfirming(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!order) return;

    let addressStr = '';
    if (order.shipping_address) {
      const addr = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;
      addressStr = [addr.street, addr.city, addr.province, addr.postalCode]
        .filter(Boolean)
        .join(', ');
    }

    try {
      generateInvoicePdf({
        orderId: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        address: addressStr,
        items: (order.items || []).map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: Number(i.price),
        })),
        subtotal: Number(order.subtotal || 0),
        shippingCost: Number(order.shipping_cost || 0),
        total: Number(order.total_price),
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
      });
    } catch (e) {
      console.error(e);
      showToast('Gagal membuat PDF invoice.', 'error');
    }
  };

  if (loading) {
    return (
      <>
        <StoreInitializer />
        <ToastProvider />
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Memuat detail pembayaran...</div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <StoreInitializer />
        <ToastProvider />
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Pesanan tidak ditemukan.</div>
        </div>
      </>
    );
  }

  const isQris = order.payment_method === 'QRIS';
  const isBank = order.payment_method === 'Bank Transfer';
  const isEwallet = order.payment_method === 'E-Wallet';

  return (
    <>
      <StoreInitializer />
      <ToastProvider />
      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 text-center">
            {done ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircleIcon" size={36} className="text-emerald-500" />
                </div>
                <h1 className="text-xl font-extrabold text-foreground">Pembayaran Berhasil!</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Pesanan <strong>#{order.id}</strong> sedang diproses.
                </p>

                <div className="rounded-2xl border border-border bg-card p-5 text-left mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Invoice</p>
                      <p className="font-extrabold text-foreground">#{order.id}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Lunas
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatRupiah(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="h-px bg-border my-3" />

                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Subtotal</span>
                    <span>{formatRupiah(Number(order.subtotal || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Ongkos Kirim</span>
                    <span>{formatRupiah(Number(order.shipping_cost || 0))}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatRupiah(Number(order.total_price))}</span>
                  </div>

                  <div className="text-xs text-muted-foreground mt-4 space-y-1">
                    <p>Metode pembayaran: <strong>{order.payment_method}</strong></p>
                    <p>Atas nama: <strong>{order.customer_name}</strong></p>
                    <p>Email: <strong>{order.customer_email}</strong></p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Salinan invoice ini juga dikirim ke email kamu (jika berhasil terkirim).
                </p>

                <button
                  className="btn-secondary w-full justify-center py-3.5 mt-4"
                  onClick={handleDownloadPdf}
                >
                  <Icon name="ArrowDownTrayIcon" size={16} /> Download Invoice (PDF)
                </button>

                <button
                  className="btn-primary w-full justify-center py-3.5 mt-3"
                  onClick={() => router.push('/')}
                >
                  Kembali ke Beranda
                </button>
              </>
            ) : (
              <>
                <h1 className="text-xl font-extrabold text-foreground mb-1">Selesaikan Pembayaran</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Pesanan <strong>#{order.id}</strong>
                </p>

                <div className="rounded-2xl border border-border bg-card p-5 text-left mb-6">
                  <p className="text-xs text-muted-foreground mb-1">Total yang harus dibayar</p>
                  <p className="text-2xl font-extrabold text-foreground mb-4">
                    {formatRupiah(Number(order.total_price))}
                  </p>

                  <div className="h-px bg-border mb-4" />

                  {isQris && (
                    <div className="text-center">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">
                        Scan QR Code berikut menggunakan aplikasi e-wallet/m-banking kamu
                      </p>
                      <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-border rounded-2xl flex items-center justify-center">
                        <Icon name="QrCodeIcon" size={80} className="text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        (Simulasi QRIS untuk keperluan demo)
                      </p>
                    </div>
                  )}

                  {isBank && (
                    <div className="text-left">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">
                        Pilih bank tujuan transfer:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.keys(BANK_DETAILS).map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                              selectedBank === bank
                                ? 'border-primary bg-secondary text-primary'
                                : 'border-border text-muted-foreground hover:border-primary'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      <div className="bg-muted rounded-xl p-4">
                        <p className="text-xs text-muted-foreground">Bank {selectedBank}</p>
                        <p className="text-lg font-extrabold tracking-wide">
                          {BANK_DETAILS[selectedBank].number}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          a.n. {BANK_DETAILS[selectedBank].name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        (Simulasi transfer untuk keperluan demo)
                      </p>
                    </div>
                  )}

                  {isEwallet && (
                    <div className="text-left">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">
                        Pilih E-Wallet tujuan:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.keys(EWALLET_DETAILS).map((ew) => (
                          <button
                            key={ew}
                            type="button"
                            onClick={() => setSelectedEwallet(ew)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                              selectedEwallet === ew
                                ? 'border-primary bg-secondary text-primary'
                                : 'border-border text-muted-foreground hover:border-primary'
                            }`}
                          >
                            {ew}
                          </button>
                        ))}
                      </div>
                      <div className="bg-muted rounded-xl p-4">
                        <p className="text-xs text-muted-foreground">{selectedEwallet}</p>
                        <p className="text-lg font-extrabold tracking-wide">
                          {EWALLET_DETAILS[selectedEwallet].number}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          a.n. {EWALLET_DETAILS[selectedEwallet].name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        (Simulasi E-Wallet untuk keperluan demo)
                      </p>
                    </div>
                  )}
                </div>

                <button
                  className="btn-primary w-full justify-center py-3.5"
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                >
                  {confirming ? (
                    <span className="inline-flex items-center gap-2">
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> Memproses...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Icon name="CheckIcon" size={16} /> Saya Sudah Bayar
                    </span>
                  )}
                </button>

                <p className="text-xs text-muted-foreground mt-4">
                  Klik tombol di atas setelah kamu menyelesaikan pembayaran.
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
