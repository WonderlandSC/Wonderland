import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { SignUpWithVerification } from './SignUpWithVerification';
import SignUpHandler from '../SignUpHandler';

const title = 'Create an account';
const description = 'Enter your details to get started.';

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
    <>
      <SignUpHandler />
      <SignUpWithVerification title="Sign Up" description="Join us today!" />
    </>
);

export default SignUpPage;