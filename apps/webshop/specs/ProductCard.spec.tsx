import React from 'react';
import { render } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard';
import { formatPrice } from '../src/utils/formatPrice';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockProduct = {
  id: '1',
  name: 'Heavy Duty Hammer',
  price: 18.99,
  imageUrl: 'https://placehold.co/300x200',
  description: 'A solid 500g steel hammer.',
  category: 'Tools',
  stock: 142,
  createdAt: '2024-01-15T10:00:00.000Z',
};

describe('ProductCard', () => {
  it('renders the product card', () => {
    const { getByTestId } = render(<ProductCard product={mockProduct} />);
    expect(getByTestId('product-card')).toBeTruthy();
  });

  it('displays the correct price', () => {
    const { getByTestId } = render(<ProductCard product={mockProduct} />);
    expect(getByTestId('product-price').textContent).toBe(formatPrice(mockProduct.price));
  });

  it('renders the product name', () => {
    const { getByTestId } = render(<ProductCard product={mockProduct} />);
    expect(getByTestId('product-card').textContent).toContain('Heavy Duty Hammer');
  });
});
