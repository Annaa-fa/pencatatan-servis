import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiceTrack - Sistem Pencatatan Servis",
  description: "Aplikasi Manajemen Transaksi dan Tracking Status Servis Elektronik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
