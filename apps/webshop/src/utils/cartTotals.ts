import { CartItem } from '../types';

export const VAT_RATE = 0.21;
export const SHIPPING_FEE = 4.95;
export const FREE_SHIPPING_THRESHOLD = 100;

export interface CartTotals {
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
}

// Assumption: listed prices are net (ex-VAT). VAT is added on top, shipping is a
// flat fee that is waived above FREE_SHIPPING_THRESHOLD. Documented in the issue report.
export function calculateTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + vat + shipping;

  return { subtotal, vat, shipping, total };
}
