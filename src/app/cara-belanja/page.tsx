import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreInitializer from '@/app/components/StoreInitializer';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    icon: 'UserPlusIcon',
    title: '1. Daftar / Masuk Akun',
    desc: 'Buat akun baru atau masuk menggunakan akun yang sudah terdaftar untuk mulai berbelanja.',
  },
  {
    icon: 'MagnifyingGlassIcon',
    title: '2. Jelajahi Katalog Produk',
    desc: 'Lihat seluruh koleksi Eau de Parfum, Body Wash, Body Scent, dan Deodorant Vitalis.',
  },
  {
    icon: 'ShoppingCartIcon',
    title: '3. Tambahkan ke Keranjang',
    desc: 'Pilih produk yang kamu suka, tentukan jumlah, lalu tambahkan ke keranjang belanja.',
  },
  {
    icon: 'ClipboardDocumentCheckIcon',
    title: '4. Checkout & Isi Alamat',
    desc: 'Lanjutkan ke checkout, lengkapi alamat pengiriman dengan data yang benar.',
  },
  {
    icon: 'CreditCardIcon',
    title: '5. Pilih Metode Pembayaran',
    desc: 'Pilih metode pembayaran yang tersedia: QRIS, Transfer Bank, atau E-Wallet.',
  },
  {
    icon: 'CheckBadgeIcon',
    title: '6. Konfirmasi Pembayaran',
    desc: 'Selesaikan pembayaran sesuai instruksi, lalu klik "Saya Sudah Bayar" untuk konfirmasi.',
  },
  {
    icon: 'TruckIcon',
    title: '7. Pesanan Diproses & Dikirim',
    desc: 'Tim kami akan memproses pesananmu, lalu mengirimkannya ke alamat tujuan.',
  },
  {
    icon: 'StarIcon',
    title: '8. Beri Ulasan',
    desc: 'Setelah barang sampai, jangan lupa beri rating dan ulasan untuk membantu pembeli lain.',
  },
];

export default function CaraBelanjaPage() {
  return (
    <>
      <StoreInitializer />
      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Cara Belanja di Vitalis
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ikuti langkah-langkah mudah berikut untuk mendapatkan produk favoritmu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((step) => (
              <div key={step.title} className="glass-card rounded-3xl p-6">
                <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <Icon name={step.icon as 'UserPlusIcon'} size={20} className="text-primary" />
                </div>
                <h2 className="font-extrabold text-base mb-1.5">{step.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-6 mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Masih ada pertanyaan? Gunakan fitur chatbot di pojok kanan bawah untuk bantuan cepat.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
