import { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext, useContext, useMemo } from 'react';
import { useCart, UseCart } from '../hooks/useCart';
import { Header } from '../components/Header';
import { RouteProgress } from '../components/RouteProgress';
import './styles.css';

interface CartContextValue {
  cart: UseCart;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCartContext(): UseCart {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartContext.Provider');
  }
  return context.cart;
}

function CustomApp({ Component, pageProps }: AppProps) {
  const cart = useCart();
  const value = useMemo(() => ({ cart }), [cart]);

  return (
    <CartContext.Provider value={value}>
      <Head>
        <title>Kramp Webshop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RouteProgress />
      <Header />
      <main className="app">
        <Component {...pageProps} />
      </main>
    </CartContext.Provider>
  );
}

export default CustomApp;
