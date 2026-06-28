import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreInitializer from '@/app/components/StoreInitializer';
import Icon from '@/components/ui/AppIcon';

export default function TentangKamiPage() {
  return (
    <>
      <StoreInitializer />
      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-10 mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Tentang Vitalis
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Live Your Dream. Wewangian premium Indonesia untuk wanita modern yang elegan dan
              penuh percaya diri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Icon name="SparklesIcon" size={22} className="text-primary" />
              </div>
              <h2 className="font-extrabold text-lg mb-2">Visi Kami</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Menjadi brand beauty &amp; personal care pilihan utama wanita Indonesia yang ingin
                tampil percaya diri dengan produk berkualitas tinggi dan harga yang terjangkau.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Icon name="HeartIcon" size={22} className="text-primary" />
              </div>
              <h2 className="font-extrabold text-lg mb-2">Misi Kami</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Menghadirkan parfum, body wash, body scent, dan deodorant dengan formula aman,
                aroma tahan lama, serta pengalaman belanja online yang mudah dan menyenangkan.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="font-extrabold text-lg mb-4">Cerita Kami</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Vitalis hadir sebagai brand beauty &amp; personal care yang telah dikenal luas oleh
                masyarakat Indonesia. Kini, Vitalis bertransformasi dari sekadar katalog produk
                menjadi platform e-commerce modern, memudahkan pelanggan untuk berbelanja langsung
                melalui website resmi.
              </p>
              <p>
                Kami berkomitmen menghadirkan produk-produk beauty &amp; personal care berkualitas,
                mulai dari Eau de Parfum dengan beragam karakter aroma, Body Wash yang menutrisi
                kulit, Body Scent yang memancarkan aura percaya diri, hingga Deodorant yang
                memberikan perlindungan maksimal sepanjang hari.
              </p>
              <p>
                Ditujukan untuk kalangan remaja dan dewasa muda, Vitalis terus berinovasi dengan
                desain modern dan pengalaman belanja yang interaktif, agar setiap pelanggan dapat
                menemukan produk yang paling sesuai dengan kepribadian mereka.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
