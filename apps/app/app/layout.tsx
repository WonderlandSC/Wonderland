import '@repo/design-system/styles/globals.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <ClerkProvider
        dynamic={true}
        appearance={{
          baseTheme: undefined,
          variables: { colorPrimary: '#000000' },
        }}
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </ClerkProvider>
    </body>
  </html>
);

export default RootLayout;
