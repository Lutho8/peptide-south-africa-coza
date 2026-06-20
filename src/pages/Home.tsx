import HeroSection from "../components/home/HeroSection";
import TrustedMarquee from "../components/home/TrustedMarquee";
import DesignedForYouSection from "../components/home/DesignedForYouSection";
import LegitimateSection from "../components/home/LegitimateSection";
import CTABanner from "../components/home/CTABanner";
import HowItWorksSection from "../components/home/HowItWorksSection";
import ReviewsSection from "../components/home/ReviewsSection";
import BlogCarousel from "../components/home/BlogCarousel";
import FAQSection from "../components/home/FAQSection";
import NewsletterCTA from "../components/home/NewsletterCTA";
import InstagramFeed from "../components/home/InstagramFeed";
import ClosingStatement from "../components/home/ClosingStatement";

export default function Home() {
  return (
    <div className="pt-0">
      <HeroSection />
      <TrustedMarquee />
      <DesignedForYouSection />
      <LegitimateSection />
      <CTABanner />
      <HowItWorksSection />
      <ReviewsSection />
      <BlogCarousel />
      <FAQSection />
      <NewsletterCTA />
      <InstagramFeed />
      <ClosingStatement />
    </div>
  );
}
