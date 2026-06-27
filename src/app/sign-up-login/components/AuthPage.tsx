'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { userStore, sessionStore, generateId, initializeStore } from '@/lib/localStorage';
import { showToast } from '@/lib/toast';
import type { User } from '@/lib/localStorage';

type Tab = 'login' | 'register';

interface VerifyPopupProps {
  email: string;
  onVerify: () => void;
  onClose: () => void;
}

function VerifyPopup({ email, onVerify, onClose }: VerifyPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-rose-xl animate-fade-scale text-center">
        <div className="w-16 h-16 rounded-full gradient-pink flex items-center justify-center mx-auto mb-5">
          <Icon name="EnvelopeIcon" size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-extrabold text-foreground mb-2">Verifikasi Email</h3>
        <p className="text-sm text-muted-foreground mb-1">Email verifikasi telah dikirim ke:</p>
        <p className="text-sm font-bold text-primary mb-4">{email}</p>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Klik tombol di bawah untuk mensimulasikan verifikasi email dan mengaktifkan akun Anda.
        </p>
        <button onClick={onVerify} className="btn-primary w-full justify-center py-3 mb-3 text-sm">
          <Icon name="CheckCircleIcon" size={16} />
          Verify Email
        </button>
        <button
          onClick={onClose}
          className="btn-ghost w-full justify-center text-sm text-muted-foreground"
        >
          Nanti saja
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [showVerify, setShowVerify] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    const u = sessionStore.get();
    if (u) {
      if (u.role === 'admin') router.push('/admin');
      else router.push('/');
    }
  }, [router]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError('');
  if (!loginEmail || !loginPassword) {
    setLoginError('Email dan password wajib diisi.');
    return;
  }
  if (!validateEmail(loginEmail)) {
    setLoginError('Format email tidak valid.');
    return;
  }
  setLoginLoading(true);
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await res.json();
    if (!data.success) {
      setLoginError(data.message);
      return;
    }
    sessionStore.set(data.user);
    showToast(`Selamat datang, ${data.user.name}! 🌸`, 'success');
    if (data.user.role === 'admin') router.push('/admin');
    else router.push('/');
  } catch {
    setLoginError('Gagal login, coba lagi.');
  } finally {
    setLoginLoading(false);
  }
};

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setRegError('');
  if (!regName.trim()) {
    setRegError('Nama lengkap wajib diisi.');
    return;
  }
  if (!validateEmail(regEmail)) {
    setRegError('Format email tidak valid.');
    return;
  }
  if (regPassword.length < 6) {
    setRegError('Password minimal 6 karakter.');
    return;
  }
  if (regPassword !== regConfirm) {
    setRegError('Password dan konfirmasi tidak cocok.');
    return;
  }
  setRegLoading(true);
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: regName.trim(),
        email: regEmail.toLowerCase(),
        password: regPassword,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      setRegError(data.message);
      return;
    }
    showToast('Akun berhasil dibuat! Silakan login 🎉', 'success');
    setTab('login');
    setLoginEmail(regEmail.toLowerCase());
  } catch {
    setRegError('Gagal registrasi, coba lagi.');
  } finally {
    setRegLoading(false);
  }
};

  const handleVerify = () => {
    if (!pendingUser) return;
    const verified = { ...pendingUser, verified: true };
    userStore.update(verified);
    sessionStore.set(verified);
    setShowVerify(false);
    showToast('Akun berhasil dibuat dan diverifikasi! 🎉', 'success');
    router.push('/');
  };

  return (
    <>
      {showVerify && pendingUser && (
        <VerifyPopup
          email={pendingUser.email}
          onVerify={handleVerify}
          onClose={() => setShowVerify(false)}
        />
      )}

      <div className="min-h-screen pt-16 lg:pt-20 flex">
        {/* Left: Image panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <AppImage
            src="https://img.rocket.new/generatedImages/rocket_gen_img_16a6191f7-1773176555752.png"
            alt="Koleksi parfum premium Vitalis dalam botol kaca elegan di atas permukaan marmer putih dengan bunga mawar pink segar, pencahayaan dramatis lembut"
            width={900}
            height={1200}
            className="w-full h-full object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-12">
            <div>
              <div className="inline-flex items-center gap-2 glass-card-dark px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  Vitalis Beauty Commerce
                </span>
              </div>
            </div>
            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-300 mb-3">
                Live Your Dream.
              </p>
              <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                Wewangian Elegan
                <br />
                untuk Wanita Modern
              </h2>
              <p className="text-white/70 text-sm leading-relaxed font-light">
                Bergabunglah dengan 2 juta+ wanita Indonesia yang telah menemukan parfum sempurna
                mereka.
              </p>
              <div className="flex items-center gap-6 mt-6">
                {[
                  { value: '20+', label: 'Tahun' },
                  { value: '2M+', label: 'Pelanggan' },
                  { value: '4.7★', label: 'Rating' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl font-extrabold text-white">{s.value}</p>
                    <p className="text-xs text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                {tab === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-light">
                {tab === 'login'
                  ? 'Masuk untuk melanjutkan belanja'
                  : 'Daftar gratis dan mulai berbelanja'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-2xl bg-secondary p-1 mb-6">
              {(['login', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setLoginError('');
                    setRegError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    tab === t
                      ? 'bg-card shadow-card text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'login' ? 'Masuk' : 'Daftar'}
                </button>
              ))}
            </div>

            {/* Admin hint */}
            <div className="mb-6 p-4 rounded-2xl bg-secondary border border-border text-xs text-muted-foreground">
              <strong className="text-foreground">Demo Admin:</strong> admin@vitalis.com / admin123
            </div>

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-field"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPwd ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="input-field pr-11"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowLoginPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showLoginPwd ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                    <Icon name="ExclamationCircleIcon" size={14} />
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-primary w-full justify-center py-3.5 text-sm mt-2 disabled:opacity-70"
                >
                  {loginLoading ? (
                    <>
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      <Icon name="ArrowRightOnRectangleIcon" size={16} /> Masuk
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="input-field"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="input-field"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPwd ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="input-field pr-11"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowRegPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showRegPwd ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Ulangi password"
                    className="input-field"
                    autoComplete="new-password"
                  />
                </div>

                {regError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                    <Icon name="ExclamationCircleIcon" size={14} />
                    {regError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="btn-primary w-full justify-center py-3.5 text-sm mt-2 disabled:opacity-70"
                >
                  {regLoading ? (
                    <>
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      <Icon name="UserPlusIcon" size={16} /> Buat Akun
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground mt-6">
              Dengan mendaftar, Anda menyetujui{' '}
              <span className="text-primary cursor-pointer hover:underline">
                Syarat & Ketentuan
              </span>{' '}
              dan{' '}
              <span className="text-primary cursor-pointer hover:underline">Kebijakan Privasi</span>{' '}
              kami.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
