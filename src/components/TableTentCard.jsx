import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TableTentCard({ tableNumber, restaurantName, tagline, theme }) {
  // Construct a URL pointing to the customer app for this table
  const url = `${window.location.origin}${window.location.pathname}?table=${tableNumber}`;

  return (
    <div className={`printable-area flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 bg-white text-gray-800 rounded-3xl max-w-sm mx-auto shadow-2xl theme-${theme}`}>
      {/* Table Tent Stand Graphic Cover */}
      <div 
        className="w-full text-center py-4 rounded-t-2xl mb-4 font-bold text-white transition-colors duration-300"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <span className="tracking-widest uppercase text-xs">MenuCard Studio</span>
      </div>

      {/* Main Body */}
      <div className="flex flex-col items-center w-full px-4 text-center">
        {/* Header Block: Logo & Table Info */}
        <div className="flex items-center justify-between w-full border-b pb-4 mb-4 border-gray-100">
          <div className="text-left">
            <h3 className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
              {restaurantName}
            </h3>
            <p className="text-xs text-gray-500 mt-1 italic">{tagline || "Where every flavor feels like home"}</p>
          </div>
          
          <div className="flex flex-col items-center bg-gray-900 text-white px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-none">Table No.</span>
            <span className="text-2xl font-black mt-1 leading-none">
              {String(tableNumber).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Scan Message */}
        <p className="text-sm font-extrabold uppercase text-gray-700 tracking-wider mb-2">
          Scan for Menu
        </p>

        {/* QR Code Container */}
        <div className="relative p-4 bg-amber-50 rounded-2xl border-4 border-dashed border-amber-300 mb-4 flex items-center justify-center">
          <QRCodeSVG
            value={url}
            size={160}
            bgColor="#fef3c7" /* Amber-50 bg */
            fgColor="var(--primary)" /* Matches theme color */
            level="H"
            includeMargin={true}
          />
          {/* Inner QR Plate Graphic Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <span className="font-black text-2xl uppercase tracking-tighter">SCAN</span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div 
          className="w-full py-3 px-4 rounded-xl text-white text-xs font-semibold uppercase tracking-wider mb-4 transition-colors duration-300"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Special Offers &amp; Recommended Dishes
        </div>

        <p className="text-[10px] text-gray-400 font-medium">
          Scan code to access our touchless digital menu. Place orders and call service directly from your phone.
        </p>

        <div className="flex items-center justify-center gap-1 mt-4 pt-4 border-t border-gray-100 w-full text-xs text-gray-500 font-semibold">
          <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          Powered by menucard.studio
        </div>
      </div>
    </div>
  );
}
