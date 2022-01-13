import { LandingLayout } from '../layouts';
import {
  CallToAction,
  Features,
  Footer,
  Guides,
  Hero,
  Pricing,
  Testimonial,
} from '../sections';

const Home = () => {
  return (
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
};

export default Home;
