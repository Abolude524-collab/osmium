import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata = {
  title: 'OSMIUM — Curated Multi-Category E-Commerce Platform',
  description: 'Discover curated technology, fashion, living essentials, and everyday objects selected with intent.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian text-primary flex flex-col min-h-screen selection:bg-cyan selection:text-obsidian">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
