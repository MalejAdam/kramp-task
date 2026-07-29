import { calculateTotals, SHIPPING_FEE } from '../src/utils/cartTotals';
import { CartItem } from '../src/types';

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  productId: '1',
  name: 'Test',
  price: 10,
  quantity: 1,
  ...overrides,
});

describe('calculateTotals', () => {
  it('returns zeroed totals for an empty cart (no shipping)', () => {
    expect(calculateTotals([])).toEqual({ subtotal: 0, vat: 0, shipping: 0, total: 0 });
  });

  it('adds 21% VAT and flat shipping below the free-shipping threshold', () => {
    const totals = calculateTotals([item({ price: 10, quantity: 2 })]);
    expect(totals.subtotal).toBe(20);
    expect(totals.vat).toBeCloseTo(4.2);
    expect(totals.shipping).toBe(SHIPPING_FEE);
    expect(totals.total).toBeCloseTo(29.15);
  });

  it('waives shipping at or above the free-shipping threshold', () => {
    const totals = calculateTotals([item({ price: 100, quantity: 1 })]);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBeCloseTo(121);
  });
});
