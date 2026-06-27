'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
  produk:
    'Vitalis Beauty memiliki 4 kategori produk: Eau de Parfum (EDP), Perfumed Body Wash, Body Scent Glamour, dan Deodorant Roll-On. Semua produk menggunakan bahan berkualitas terbaik! 🌸',
  parfum:
    'Kami memiliki 3 varian EDP unggulan: Juicy Luxe (fruity floral), Glam Slay (bergamot berry), dan Eau de Royale Charming Majesty (floral woody mewah). Semua tersedia dalam 30ml dan 60ml. 💐',
  pengiriman:
    'Kami melakukan pengiriman ke seluruh Indonesia! Estimasi pengiriman 2-5 hari kerja. Ongkos kirim mulai Rp 15.000. Gratis ongkir untuk pembelian di atas Rp 300.000! 🚚',
  pembayaran:
    'Tersedia 3 metode pembayaran: QRIS (scan & pay), Transfer Bank (BCA, Mandiri, BNI, BRI), dan E-Wallet (GoPay, OVO, Dana). Semua transaksi aman dan terenkripsi. 💳',
  promo:
    'Promo terkini: Diskon hingga 25% untuk semua produk EDP! Gratis ongkir min. pembelian Rp 300.000. Bundling Body Wash + Deodorant hemat Rp 15.000. Cek katalog sekarang! 🎉',
  harga:
    'Harga produk Vitalis: EDP mulai Rp 119.000, Body Wash Rp 32.000, Body Scent Rp 45.000, Deodorant Rp 22.000. Harga terjangkau, kualitas premium! ✨',
  stok: 'Untuk mengecek ketersediaan stok, silakan buka halaman detail produk di katalog kami. Jika stok hampir habis, akan ada notifikasi khusus. 📦',
  default:
    'Terima kasih sudah menghubungi Vitalis Beauty! Saya bisa membantu informasi tentang produk, pengiriman, pembayaran, dan promo. Ketik kata kunci atau pilih pertanyaan di bawah. 💕',
};

const QUICK_QUESTIONS = ['produk', 'pengiriman', 'pembayaran', 'promo', 'harga'];

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (lower.includes(key)) return BOT_RESPONSES[key];
  }
  return BOT_RESPONSES.default;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      from: 'bot',
      text: 'Halo! 👋 Selamat datang di Vitalis Beauty. Saya siap membantu Anda! Ada yang bisa saya bantu?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      from: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(
      () => {
        setTyping(false);
        const botMsg: Message = {
          id: `b_${Date.now()}`,
          from: 'bot',
          text: getBotReply(text),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      },
      900 + Math.random() * 600
    );
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full gradient-pink shadow-rose-lg flex items-center justify-center text-white animate-chat-bounce hover:scale-110 transition-transform"
        aria-label="Buka chatbot"
      >
        {open ? (
          <Icon name="XMarkIcon" size={24} />
        ) : (
          <Icon name="ChatBubbleLeftRightIcon" size={24} />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-3xl shadow-rose-xl overflow-hidden border border-border animate-fade-scale">
          {/* Header */}
          <div className="gradient-pink px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="SparklesIcon" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Vitalis Beauty Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-background h-72 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'gradient-pink text-white rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground/50"
                      style={{ animation: `floatY 0.8s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="bg-background px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-secondary text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors capitalize"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-background px-4 pb-4 pt-2 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ketik pesan..."
              className="input-field flex-1 text-xs py-2.5"
            />
            <button
              onClick={() => sendMessage(input)}
              className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center text-white hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <Icon name="PaperAirplaneIcon" size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
