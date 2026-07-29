import React from 'react';
import { render } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('Index', () => {
  it('should render successfully', () => {
    const { default: HomePage } = require('../src/pages/index');
    const { baseElement } = render(
      <HomePage featured={[]} generatedAt={new Date('2024-01-01T10:00:00.000Z').toISOString()} />
    );
    expect(baseElement).toBeTruthy();
  });
});
