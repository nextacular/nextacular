import Meta from '@/components/Meta/index';
import { LandingLayout } from '@/layouts/index';
import {
  CallToAction,
  Features,
  Footer,
  Guides,
  Hero,
  Pricing,
  Testimonial,
} from '@/sections/index';

const Home = () => {
  return (
    <LandingLayout>
      <Meta
        title="NextJS SaaS Boilerplate"
        description="A boilerplate for your NextJS SaaS projects."
      />
      <Hero />
      <Features />
      <Pricing />
      <Guides />
      <Testimonial />
      <CallToAction />
      <Footer />
    </LandingLayout>
  );
};

export default Home;
