import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Arc Browser Split Pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <AppLogo size={90} />
              <div>
                <p className="font-extrabold text-lg tracking-tight text-foreground leading-none">
                  Vitalis
                </p>
                <p className="text-xs font-medium text-muted-foreground leading-none">
                  Beauty Commerce
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Live Your Dream. Wewangian premium Indonesia untuk wanita modern yang elegan dan penuh
              percaya diri.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'GlobeAltIcon', label: 'Website' },
                { icon: 'ChatBubbleLeftRightIcon', label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  <Icon name={s.icon as 'GlobeAltIcon'} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Links */}
          <div className="grid grid-cols-2 gap-8 md:justify-end">
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Produk
              </p>
              <ul className="space-y-3">
                {['Eau de Parfum', 'Body Wash', 'Body Scent', 'Deodorant'].map((item) => (
                  <li key={item}>
                    <Link
                      href="/product-catalog"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Bantuan
              </p>
              <ul className="space-y-3">
                {[
                  { label: 'Tentang Kami', href: '/tentang-kami' },
                  { label: 'Cara Belanja', href: '/cara-belanja' },
                  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
                  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Vitalis Beauty Commerce. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors">
              Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-primary transition-colors">
              Ketentuan
            </Link>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Sistem Normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
