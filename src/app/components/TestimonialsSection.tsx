'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface DBReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  product_name?: string;
  created_at: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? 'star-filled' : 'text-muted-foreground/30'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews/latest')
      .then(r => r.json())
      .then(data => { if (data.success) setReviews(data.reviews); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
            Ulasan Pelanggan
          </span>
          <h2 className="text-hero-md font-extrabold text-foreground tracking-tight mb-4">
            Mereka{' '}
            <span className="text-transparent" style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #D4778A, #C9956D)' }}>
              Menyukainya
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto font-light">
            Ulasan nyata dari pelanggan setia Vitalis Beauty.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground">Memuat ulasan...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Belum ada ulasan. Jadilah yang pertama mengulas! ⭐
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={r.id} className={`glass-card rounded-3xl p-7 flex flex-col gap-5 hover:shadow-rose-md transition-all duration-300 hover:-translate-y-1 ${i === 1 ? 'md:mt-6' : ''}`}>
                <StarRating rating={r.rating} />
                <p className="text-sm text-foreground leading-relaxed font-light flex-1 italic">
                  &ldquo;{r.comment || 'Produk bagus!'}&rdquo;
                </p>
                {r.product_name && (
                  <span className="badge badge-primary self-start text-xs">{r.product_name}</span>
                )}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate">{r.user_name}</p>
                      <Icon name="CheckBadgeIcon" size={14} className="text-primary flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground">Pembeli terverifikasi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
