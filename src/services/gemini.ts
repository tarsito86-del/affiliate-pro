import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface ProductAnalysis {
  name: string;
  gmvPotential: "High" | "Medium" | "Low";
  trendingScore: number;
  competitionLevel: "High" | "Medium" | "Low";
  reasoning: string;
  keywords: string[];
}

export interface ScriptSuggestion {
  hook: string;
  body: string;
  cta: string;
  seoKeywords: string[];
  violationCheck: {
    isSafe: boolean;
    warnings: string[];
  };
}

export const analyzeProduct = async (productName: string, niche: string): Promise<ProductAnalysis[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the TikTok Shop potential for "${productName}" in the "${niche}" niche specifically for the Philippines (PH) market. 
    Suggest 3-5 specific products related to this search query that are currently trending or have high demand in the Philippines.
    For each product, provide GMV potential (High/Medium/Low), trending score (0-100), competition level (High/Medium/Low), reasoning (mentioning PH-specific consumer behavior), and SEO keywords.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            gmvPotential: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            trendingScore: { type: Type.NUMBER },
            competitionLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            reasoning: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "gmvPotential", "trendingScore", "competitionLevel", "reasoning", "keywords"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
};

export const generateScript = async (product: string, targetAudience: string): Promise<ScriptSuggestion> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a TikTok affiliate script for "${product}" targeting "${targetAudience}" in the Philippines. 
    The script should be in Taglish (a mix of Tagalog and English) or casual English as commonly used by Filipino TikTok creators.
    Include a hook, body, and CTA. Also check for potential TikTok community guideline violations (e.g., medical claims, misleading info).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          cta: { type: Type.STRING },
          seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          violationCheck: {
            type: Type.OBJECT,
            properties: {
              isSafe: { type: Type.BOOLEAN },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["isSafe", "warnings"],
          },
        },
        required: ["hook", "body", "cta", "seoKeywords", "violationCheck"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const getTrendingNiches = async (): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Search for the top 5 trending TikTok Shop niches right now in 2026 specifically in the Philippines (PH). Return only a JSON array of strings.",
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const getViralProductSuggestions = async (niche: string, audience: string, count: number = 20): Promise<ProductAnalysis[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search for ${count} currently viral products on TikTok Shop for the "${niche}" niche targeting "${audience}" specifically in the Philippines (PH). 
    Use real-time web data to find products that are trending in the Philippine market in March 2026.
    For each product, provide GMV potential (High/Medium/Low), trending score (0-100), competition level (High/Medium/Low), reasoning (PH context, keep it brief), and SEO keywords.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            gmvPotential: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            trendingScore: { type: Type.NUMBER },
            competitionLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            reasoning: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["name", "gmvPotential", "trendingScore", "competitionLevel", "reasoning", "keywords"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
};

export interface VideoAnalysis {
  metrics: {
    views: string;
    likes: string;
    shares: string;
    comments: string;
  };
  factors: {
    niche: string;
    keywords: string[];
    videoLength: string;
    audioTrend: "High" | "Medium" | "Low";
    hookStrength: number;
  };
  tips: string[];
}

export const analyzeVideo = async (videoUrl: string): Promise<VideoAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the performance potential of this TikTok video URL: "${videoUrl}" within the Philippines market. 
    Since you cannot browse the live web directly for private metrics, simulate an analysis based on the URL structure and common viral patterns for Filipino TikTok content. 
    Provide estimated metrics, key factors (niche, keywords, length, audio trend), and 3 actionable tips for improvement specifically for the PH audience.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.OBJECT,
            properties: {
              views: { type: Type.STRING },
              likes: { type: Type.STRING },
              shares: { type: Type.STRING },
              comments: { type: Type.STRING },
            },
            required: ["views", "likes", "shares", "comments"],
          },
          factors: {
            type: Type.OBJECT,
            properties: {
              niche: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              videoLength: { type: Type.STRING },
              audioTrend: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              hookStrength: { type: Type.NUMBER },
            },
            required: ["niche", "keywords", "videoLength", "audioTrend", "hookStrength"],
          },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["metrics", "factors", "tips"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeUploadedVideo = async (base64Video: string, mimeType: string): Promise<VideoAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        inlineData: {
          data: base64Video,
          mimeType: mimeType,
        },
      },
      {
        text: "Analyze this TikTok video in the context of the Philippines (PH) market. Provide estimated metrics (views, likes, shares, comments) based on its content quality and viral potential for a Filipino audience. Also identify the niche, keywords, video length, audio trend strength, and hook strength (0-100). Provide 3 actionable tips for improvement specifically for PH creators.",
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.OBJECT,
            properties: {
              views: { type: Type.STRING },
              likes: { type: Type.STRING },
              shares: { type: Type.STRING },
              comments: { type: Type.STRING },
            },
            required: ["views", "likes", "shares", "comments"],
          },
          factors: {
            type: Type.OBJECT,
            properties: {
              niche: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              videoLength: { type: Type.STRING },
              audioTrend: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              hookStrength: { type: Type.NUMBER },
            },
            required: ["niche", "keywords", "videoLength", "audioTrend", "hookStrength"],
          },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["metrics", "factors", "tips"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateVideo = async (prompt: string) => {
  // Create a fresh instance to ensure it uses the latest API key from the dialog
  const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY! });
  const operation = await videoAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16'
    }
  });
  return operation;
};

export const getOperationStatus = async (operation: any) => {
  const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY! });
  return await videoAi.operations.getVideosOperation({ operation });
};
