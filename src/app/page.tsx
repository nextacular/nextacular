import type { Metadata } from 'next';

import LandingLayout from '@/layouts/LandingLayout';
import {
  CallToAction,
  Features,
  Footer,
  Guides,
  Hero,
  Pricing,
  Testimonial,
} from '@/sections/index';

export const metadata: Metadata = {
  title: 'NextJS SaaS Boilerplate',
  description: 'A boilerplate for your NextJS SaaS projects.',
};

const HomePage = () => (
  <LandingLayout>
    <Hero />
    <Features />
    <Pricing />
    <Guides />
    <Testimonial />
    <CallToAction />
    <Footer />
  </LandingLayout>
);

export default HomePage;
