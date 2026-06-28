import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreInitializer from '@/app/components/StoreInitializer';

const sections = [
  {
    title: '1. Penerimaan Syarat',
    body: 'Dengan mengakses dan menggunakan website Vitalis Beauty Commerce, kamu dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.',
  },
  {
    title: '2. Akun Pengguna',
    body: 'Pengguna wajib memberikan data yang benar dan akurat saat melakukan registrasi. Setiap aktivitas yang terjadi melalui akun pengguna menjadi tanggung jawab pemilik akun.',
  },
  {
    title: '3. Pemesanan dan Pembayaran',
    body: 'Pesanan dianggap sah setelah pembayaran dikonfirmasi melalui sistem. Harga produk yang tercantum dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.',
  },
  {
    title: '4. Pengiriman',
    body: 'Estimasi waktu pengiriman dapat bervariasi tergantung lokasi tujuan. Vitalis tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak jasa pengiriman.',
  },
  {
    title: '5. Pengembalian dan Pembatalan',
    body: 'Pembatalan pesanan hanya dapat dilakukan sebelum status pesanan diproses. Pengembalian produk dapat dilakukan sesuai dengan kebijakan retur yang berlaku.',
  },
  {
    title: '6. Hak Kekayaan Intelektual',
    body: 'Seluruh konten dalam website ini, termasuk logo, gambar produk, dan teks, merupakan hak milik Vitalis dan dilindungi oleh hukum yang berlaku.',
  },
  {
    title: '7. Perubahan Ketentuan',
    body: 'Vitalis berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif sejak dipublikasikan pada halaman ini.',
  },
];

export default function SyaratKetentuanPage() {
  return (
    <>
      <StoreInitializer />
      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Syarat &amp; Ketentuan
            </h1>
            <p className="text-sm text-muted-foreground">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Syarat dan ketentuan berikut mengatur penggunaan layanan Vitalis Beauty Commerce.
              Mohon membaca dengan seksama sebelum menggunakan layanan kami.
            </p>

            <div className="space-y-6">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="font-extrabold text-base mb-2">{s.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
