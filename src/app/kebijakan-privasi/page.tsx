import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreInitializer from '@/app/components/StoreInitializer';

const sections = [
  {
    title: '1. Data yang Kami Kumpulkan',
    body: 'Kami mengumpulkan data seperti nama, alamat email, nomor telepon, dan alamat pengiriman yang kamu berikan saat mendaftar, berbelanja, atau menghubungi layanan pelanggan kami.',
  },
  {
    title: '2. Penggunaan Data',
    body: 'Data yang dikumpulkan digunakan untuk memproses pesanan, mengirimkan invoice, memberikan informasi terkait status pesanan, serta meningkatkan kualitas layanan kami.',
  },
  {
    title: '3. Keamanan Data',
    body: 'Kami berkomitmen menjaga keamanan data pribadi pengguna. Password akun disimpan dalam bentuk terenkripsi (hashed) dan tidak dapat dibaca dalam bentuk aslinya oleh siapapun, termasuk tim internal kami.',
  },
  {
    title: '4. Pembagian Data dengan Pihak Ketiga',
    body: 'Kami tidak akan menjual atau membagikan data pribadi pengguna kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan pengguna, kecuali diwajibkan oleh hukum yang berlaku.',
  },
  {
    title: '5. Hak Pengguna',
    body: 'Pengguna memiliki hak untuk mengakses, memperbarui, atau menghapus data pribadinya melalui halaman profil akun, atau dengan menghubungi layanan pelanggan kami.',
  },
  {
    title: '6. Perubahan Kebijakan',
    body: 'Kebijakan privasi ini dapat berubah dari waktu ke waktu. Perubahan akan diinformasikan melalui halaman ini agar pengguna selalu mengetahui bagaimana data mereka dilindungi.',
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      <StoreInitializer />
      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Kebijakan Privasi
            </h1>
            <p className="text-sm text-muted-foreground">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Vitalis Beauty Commerce menghargai dan menghormati privasi setiap pengguna. Kebijakan
              ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi
              kamu saat menggunakan layanan kami.
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
