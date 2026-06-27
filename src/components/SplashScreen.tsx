'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] splash-screen pointer-events-none">
      {/* Background layers */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(closest-side_at_50%_35%,rgba(255,255,255,0.45),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(closest-side_at_50%_70%,rgba(45,27,30,0.07),transparent_55%)]" />

      {/* Blob decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 blob-primary animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 blob-accent animate-float-slow" />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center gap-4">
        {/* No visible frame: only soft glow around logo */}
        <div className="glass-card flex flex-col items-center justify-center rounded-[2rem] px-10 py-8 gap-3">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(212,119,138,0.18),transparent_60%)] blur-2xl" />
            <div className="relative">
              <AppLogo src="/assets/images/logo_baru.png" size={160} />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Vitalis
            </h1>
            <p className="text-sm md:text-base font-medium text-primary tracking-[0.22em] uppercase">
              Beauty Commerce
            </p>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground italic">Live Your Dream.</p>

          {/* Loading indicator: shimmer bar + pulsing dots */}
          <div className="w-full max-w-[280px] mt-2">
            <div className="h-2 rounded-full overflow-hidden bg-white/35">
              <div className="h-full w-1/3 bg-[linear-gradient(90deg,transparent,rgba(212,119,138,0.55),transparent)] animate-shimmer" />
            </div>
            <div className="flex gap-2 mt-3 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                  style={{
                    animation: `floatY 0.9s ease-in-out ${i * 0.18}s infinite`,
                    boxShadow: '0 0 0 6px rgba(212,119,138,0.08)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Subtle bottom highlight */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[70vw] max-w-[620px] h-px bg-gradient-to-r from-transparent via-[rgba(212,119,138,0.35)] to-transparent" />
      </div>
    </div>
  );
}
