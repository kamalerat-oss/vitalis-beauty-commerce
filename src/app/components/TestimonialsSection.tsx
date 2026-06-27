import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const testimonials = [
  {
    name: 'Josepha Maria Fangohoi',
    location: 'OhoiFaan, Maluku Tenggara',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1afd11909-1773597979398.png',
    rating: 5,
    text: 'Vitalis EDP Juicy Luxe adalah parfum favorit saya! Wanginya tahan lama banget, sampai sore masih tercium. Harganya juga sangat terjangkau dibanding parfum import.',
    product: 'EDP Juicy Luxe',
    verified: true,
  },
  {
    name: 'Paulus Araujo Aby',
    location: 'KefaMenanu, Nusa Tenggara Timur',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e2e78dfd-1773249711191.png',
    rating: 5,
    text: 'Parfum Glam Slay cocok banget buat daily wear. Wangi bergamot dan berriesnya fresh tapi tetap elegan. Banyak yang nanya wangi apa yang saya pakai!',
    product: 'EDP Glam Slay',
    verified: true,
  },
  {
    name: 'Friska Nurul Inayah',
    location: 'Cilongok , Jawa Tengah',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_18d89ca22-1765658620801.png',
    rating: 5,
    text: 'Body wash Fresh Dazzle bikin mandi jadi ritual mewah. Wanginya bergamot segar, kulitnya jadi lembut setelah pakai. Sudah repeat order 3x!',
    product: 'Body Wash Fresh Dazzle',
    verified: true,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
            Ulasan Pelanggan
          </span>
          <h2 className="text-hero-md font-extrabold text-foreground tracking-tight mb-4">
            Mereka{' '}
            <span
              className="text-transparent"
              style={{
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                backgroundImage: 'linear-gradient(135deg, #D4778A, #C9956D)',
              }}
            >
              Menyukainya
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto font-light">
            Lebih dari 2,000+ ulasan positif dari pelanggan setia Vitalis Beauty.
          </p>
        </div>

        {/* Testimonial cards — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((t, i) => (
            <div
              key={t?.name}
              className={`glass-card rounded-3xl p-7 flex flex-col gap-5 hover:shadow-rose-md transition-all duration-300 hover:-translate-y-1 ${
                i === 1 ? 'md:mt-6' : ''
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t?.rating)]?.map((_, si) => (
                  <svg key={si} className="w-4 h-4 star-filled" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground leading-relaxed font-light flex-1 italic">
                &ldquo;{t?.text}&rdquo;
              </p>

              {/* Product badge */}
              <span className="badge badge-primary self-start text-xs">{t?.product}</span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <AppImage
                    src={t?.avatar}
                    alt={`Foto profil ${t?.name}, pelanggan Vitalis Beauty dari ${t?.location}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground truncate">{t?.name}</p>
                    {t?.verified && (
                      <Icon
                        name="CheckBadgeIcon"
                        size={14}
                        className="text-primary flex-shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{t?.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
