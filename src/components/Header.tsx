'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { sessionStore, cartStore, initializeStore } from '@/lib/localStorage';
import type { User } from '@/lib/localStorage';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const refresh = useCallback(() => {
  initializeStore();

  const currentUser = sessionStore.get();

  setUser(currentUser);

  if (currentUser) {
    setCartCount(cartStore.count());
  } else {
    setCartCount(0);
  }
}, []);

 useEffect(() => {
  refresh();

  const onStorage = () => refresh();

  const onCartUpdate = () => {
    const currentUser = sessionStore.get();

    if (currentUser) {
      setCartCount(cartStore.count());
    } else {
      setCartCount(0);
    }
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener('vitalis-cart-update', onCartUpdate);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('vitalis-cart-update', onCartUpdate);
  };
}, [refresh]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
  sessionStore.clear();
  setUser(null);
  setCartCount(0);
  router.push('/');
};

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/product-catalog', label: 'Produk' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl shadow-rose-sm border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <AppLogo size={90} />
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-foreground leading-none">
                  Vitalis
                </span>
                <span className="text-xs font-medium text-muted-foreground leading-none tracking-wide">
                  Beauty Commerce
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-primary bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart (customer only) */}
              {(!user || user.role !== 'admin') && (
                <button
                  onClick={() => router.push('/cart')}
                  className="relative p-2.5 rounded-full hover:bg-muted transition-colors"
                  aria-label="Keranjang belanja"
                >
                  <Icon name="ShoppingBagIcon" size={22} className="text-foreground" />
                  {user && cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full gradient-pink text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                </button>
              )}

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link href="/admin" className="btn-secondary text-xs py-2 px-4">
                      Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted">
                    <div className="w-7 h-7 rounded-full gradient-pink flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                    >
                      <Icon name="ArrowRightOnRectangleIcon" size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/sign-up-login"
                  className="hidden md:inline-flex btn-primary text-xs py-2.5 px-5"
                >
                  Masuk / Daftar
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2.5 rounded-full hover:bg-muted transition-colors"
                aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              >
                <Icon
                  name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'}
                  size={22}
                  className="text-foreground"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-4 right-4 glass-card rounded-2xl p-6 shadow-rose-lg">
            <nav className="flex flex-col gap-2 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-muted text-primary'
                      : 'text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {user ? (
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-pink flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link href="/admin" className="btn-secondary text-sm py-2.5 text-center">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-sm py-2.5 w-full justify-center text-red-500 hover:bg-red-50"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={16} />
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/sign-up-login"
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
