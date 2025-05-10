import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Riskpay',
  description: 'A simple and faster payment gateway for credit cards, cryptocurrency, and bank transfers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ToastContainer theme="colored" />
      </body>
    </html>
  );
}
