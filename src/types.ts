export interface UserPreferences {
  niche: string;
  targetAudience: {
    ageRange: string;
    interests: string[];
  };
  contentStyles: string[];
  experienceLevel: "Beginner" | "Intermediate" | "Expert";
  language: string;
}

export interface Product {
  id: string;
  name: string;
  gmvPotential: "High" | "Medium" | "Low";
  trendingScore: number;
  competitionLevel: "High" | "Medium" | "Low";
  reasoning: string;
  keywords: string[];
  createdAt: string;
}

export interface Script {
  id: string;
  productId: string;
  productName: string;
  hook: string;
  body: string;
  cta: string;
  seoKeywords: string[];
  isSafe: boolean;
  warnings: string[];
  createdAt: string;
}
