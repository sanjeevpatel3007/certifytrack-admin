import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/common/auth-provider';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CertifyTrack Admin',
  description: 'Admin panel for CertifyTrack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
