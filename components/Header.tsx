'use client';

import React from 'react';
import { Wrench } from 'lucide-react';

interface HeaderProps {
  isCloudMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isCloudMode }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">ServiceTrack</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/60">
                Next.js + React
              </span>
            </div>
            <p className="text-xs text-slate-500">Sistem Manajemen Penerimaan & Pelacakan Status Servis</p>
          </div>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center gap-2">
          {isCloudMode ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Supabase Active</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Local Demo Mode (localStorage)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
