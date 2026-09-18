import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TableTentCard({ tableNumber = 4, restaurantName = "Abu Coffee" }) {
  const { t } = useLanguage();
  // Construct a URL pointing to the customer app for this table
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://abu-coffee.vercel.app';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const url = `${origin}${pathname}?table=${tableNumber}`;

  return (
    <div className="printable-area flex flex-col items-center select-none w-full max-w-xs mx-auto py-2">
      {/* Acrylic Card Stand Body */}
      <div className="w-full bg-gradient-to-b from-[#181d24] via-[#12151b] to-[#0c0e12] text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header matching reference poster */}
        <div className="w-full text-center pb-3 border-b border-white/10">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <img 
              src="/abu-coffee-logo.png" 
              alt="Abu Coffee Logo" 
              className="w-9 h-9 rounded-full border border-amber-500/40 shadow-sm object-cover bg-black"
            />
            <span className="text-xs font-black tracking-wider uppercase text-amber-300">
              {restaurantName}
            </span>
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-300">
            {t('tentScanTo')}
          </p>
          <h2 className="text-base font-black uppercase tracking-wider text-emerald-400 mt-0.5">
            {t('tentViewMenu')}
          </h2>
        </div>

        {/* QR Code Container with Stylish Corner Framing Brackets */}
        <div className="relative my-5 p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          {/* Top-Left Corner Bracket */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-emerald-600 rounded-tl-md"></div>
          {/* Top-Right Corner Bracket */}
          <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-emerald-600 rounded-tr-md"></div>
          {/* Bottom-Left Corner Bracket */}
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-emerald-600 rounded-bl-md"></div>
          {/* Bottom-Right Corner Bracket */}
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-emerald-600 rounded-br-md"></div>

          <QRCodeSVG
            value={url}
            size={155}
            bgColor="#ffffff"
            fgColor="#111827"
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/abu-coffee-logo.png",
              x: undefined,
              y: undefined,
              height: 34,
              width: 34,
              excavate: true,
            }}
          />
        </div>

        {/* Table Number Identifier Pill */}
        <div className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t('tableLabel')} {String(tableNumber).padStart(2, '0')}</span>
        </div>

        {/* 3 Numbered Steps as shown in the inspiration poster */}
        <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-white/10 text-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 mb-1.5 shadow-sm">
              <Icons.QrCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-200 leading-tight">{t('tentStep1')}</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 mb-1.5 shadow-sm">
              <Icons.BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-200 leading-tight">{t('tentStep2')}</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 mb-1.5 shadow-sm">
              <Icons.Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-200 leading-tight">{t('tentStep3')}</span>
          </div>
        </div>

        {/* WhatsApp Notice Badge */}
        <div className="mt-4 pt-2 w-full text-[10px] font-medium text-gray-400 flex items-center justify-center gap-1.5">
          <Icons.MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('tentWhatsAppBadge')}</span>
        </div>
      </div>

      {/* Realistic Wooden Base Stand Block (as seen in the reference poster) */}
      <div className="w-full h-7 rounded-xl wood-texture border-t border-amber-200/20 -mt-2.5 z-10 flex items-center justify-center shadow-2xl relative">
        {/* Subtle wood highlight slit */}
        <div className="w-48 h-1 bg-black/40 rounded-full"></div>
      </div>
    </div>
  );
}
