export type TrustHighlightIcon = "medical" | "encrypted" | "payment";

export interface HeroSection {
  headline: string;
  subtext: string;
}

export interface ServiceCard {
  title: string;
  description: string;
  ctaButtonLabel: string;
  showRecommendedBadge: boolean;
}

export interface InfoBanner {
  enabled: boolean;
  description: string;
}

export interface TrustHighlight {
  icon: TrustHighlightIcon;
  title: string;
  description: string;
}

export interface LandingExperience {
  hero: HeroSection;
  guidedHealthCheck: ServiceCard;
  fullBloodTest: ServiceCard;
  infoBanner: InfoBanner;
  trustHighlights: TrustHighlight[];
}

export interface LandingPageSettings {
  beforeLogin: LandingExperience;
  afterLogin: LandingExperience;
}

const defaultBeforeLogin: LandingExperience = {
  hero: {
    headline: "Get personalised health guidance based on your unique profile",
    subtext:
      "HealthPilot offers tailored insights into your wellbeing. Our system provides guidance only, empowering you with knowledge. No preparation needed. Simply choose your path to begin.",
  },
  guidedHealthCheck: {
    title: "Start Guided Health Check",
    description:
      "Answer a few questions to receive personalised guidance. You can upload blood test results now or later if available.",
    ctaButtonLabel: "Get Started",
    showRecommendedBadge: true,
  },
  fullBloodTest: {
    title: "Full Blood Test Analysis",
    description:
      "Upload an existing blood test or order a new test through HealthPilot, then return to continue your health check.",
    ctaButtonLabel: "Start Blood Test",
    showRecommendedBadge: true,
  },
  infoBanner: {
    enabled: true,
    description:
      "You can begin without any preparation. The system will guide you step by step.",
  },
  trustHighlights: [
    {
      icon: "medical",
      title: "Not a medical diagnosis",
      description: "Guidance only, supporting your health journey.",
    },
    {
      icon: "encrypted",
      title: "Private and secure data",
      description: "Your information is protected with advanced encryption.",
    },
    {
      icon: "payment",
      title: "No payment required",
      description: "Free to begin exploring your personalised health insights.",
    },
  ],
};

const defaultAfterLogin: LandingExperience = {
  ...defaultBeforeLogin,
  hero: {
    headline: "Welcome back to HealthPilot",
    subtext:
      "Based on your last health check, you can continue your journey or start a new one anytime.",
  },
};

export const defaultLandingPageSettings: LandingPageSettings = {
  beforeLogin: defaultBeforeLogin,
  afterLogin: defaultAfterLogin,
};
