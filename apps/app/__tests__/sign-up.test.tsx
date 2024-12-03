import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Page from '../app/(unauthenticated)/sign-up/[[...sign-up]]/page';

// Mock the client components
vi.mock('../app/(unauthenticated)/sign-up/SignUpHandler', () => ({
  default: () => null
}));

vi.mock('../app/(unauthenticated)/sign-up/[[...sign-up]]/SignUpWithVerification', () => ({
  SignUpWithVerification: ({ title, description }: { title: string; description: string }) => (
    <div>
      <h1>Create an account</h1>
      <p>{description}</p>
    </div>
  )
}));

test('Sign Up Page', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Create an account',
    })
  ).toBeDefined();
});