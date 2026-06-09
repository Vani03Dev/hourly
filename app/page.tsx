import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedExperts } from "@/components/home/FeaturedExperts";
import { Categories } from "@/components/home/Categories";
import { Pricing } from "@/components/home/Pricing";
import { WhyHourly } from "@/components/home/WhyHourly";
import { Testimonials } from "@/components/home/Testimonials";

import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Hero />
      <HowItWorks />
      <FeaturedExperts />
      <Categories />
      <Pricing />
      <WhyHourly />
      <Testimonials />
    </Box>
  );
}
