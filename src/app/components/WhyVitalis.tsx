import React from 'react';
import Icon from '@/components/ui/AppIcon';

const features = [
  {
    icon: 'SparklesIcon',
    title: 'Kualitas Premium',
    description:
      'Bahan baku pilihan berkualitas internasional, diproses sesuai standar mutu ketat untuk menghasilkan wewangian terbaik.',
    color: 'from-pink-500/20 to-rose-400/10',
    iconColor: 'text-primary',
  },
  {
    icon: 'ClockIcon',
    title: 'Tahan Lama Seharian',
    description:
      'Formula Joyful Inside Scent™ memastikan wewangian bertahan 8-12 jam, menemani aktivitasmu dari pagi hingga malam.',
    color: 'from-rose-400/20 to-pink-300/10',
    iconColor: 'text-accent',
  },
  {
    icon: 'HeartIcon',
    title: 'Ramah untuk Semua Kulit',
    description:
      'Diformulasikan khusus untuk kulit wanita Asia, lembut dan tidak mengiritasi bahkan untuk kulit sensitif sekalipun.',
    color: 'from-amber-400/15 to-rose-300/10',
    iconColor: 'text-accent',
  },
  {
    icon: 'TruckIcon',
    title: 'Pengiriman Cepat',
    description:
      'Pengiriman ke seluruh Indonesia dalam 2-5 hari kerja. Gratis ongkir untuk pembelian di atas Rp 300.000.',
    color: 'from-primary/15 to-accent/10',
    iconColor: 'text-primary',
  },
];

export default function WhyVitalis() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
            Keunggulan Kami
          </span>
          <h2 className="text-hero-md font-extrabold text-foreground tracking-tight mb-4">
            Mengapa Memilih{' '}
            <span
              className="text-transparent"
              style={{
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                backgroundImage: 'linear-gradient(135deg, #D4778A, #C9956D)',
              }}
            >
              Vitalis?
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Lebih dari 20 tahun berpengalaman di industri wewangian, Vitalis telah menjadi pilihan
            jutaan wanita Indonesia.
          </p>
        </div>

        {/* 4-feature bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="glass-card rounded-3xl p-7 flex flex-col gap-5 group hover:shadow-rose-md transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon name={feat.icon as 'SparklesIcon'} size={22} className={feat.iconColor} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '20+', label: 'Tahun Berpengalaman' },
            { value: '2M+', label: 'Pelanggan Setia' },
            { value: '64K+', label: 'Followers Instagram' },
            { value: '4.7★', label: 'Rating Rata-rata' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-card border border-border shadow-card"
            >
              <p className="text-3xl font-extrabold text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
