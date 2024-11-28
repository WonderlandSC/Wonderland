import { showBetaFeature } from '@repo/feature-flags';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { Cases } from './components/cases';
import { CTA } from './components/cta';
import { FAQ } from './components/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
import { PricingPageClient } from '../../../app/app/(authenticated)/settings/pricing/pricing-page-client';
import { PricingGrid } from '../../../app/app/(authenticated)/settings/pricing/pricing-grid';
const meta = {
  title: 'Wonderland',
  description:
    "Wonderland is a full service digital agency that specializes in creating a wide range of web applications, including portfolios, blogs, document management systems, databases, and AI integrations.",
};

export const metadata: Metadata = createMetadata(meta);



const Home = async () => {
  const betaFeature = await showBetaFeature();
  
  // Fetch groups from the API service
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { groups = [] } = await response.json();
  
  const hopGroups = groups.filter((g: any) => g.name.toLowerCase().startsWith('hop'));
  const growUpGroups = groups.filter((g: any) => g.name.toLowerCase().includes('grow up'));
  
  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available test
        </div>
      )}
      <Hero />

      <PricingGrid 
        hopGroups={hopGroups.reverse()} 
        growUpGroups={growUpGroups.reverse()} 
        showSettings={false}
      />
      <Cases />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
