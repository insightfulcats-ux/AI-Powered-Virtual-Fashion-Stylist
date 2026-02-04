
import { GoogleGenAI, Type } from "@google/genai";
import { BodyType, OutfitRecommendation, ClothingItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingRecommendation = async (
  profile: any,
  occasion: string,
  userPhotoBase64?: string
): Promise<OutfitRecommendation> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Act as a professional high-fashion personal stylist. 
    User Profile:
    - Body Type: ${profile.bodyType || 'General'}
    - Preferences: ${profile.stylePreferences.join(', ')}
    - Occasion: ${occasion}

    Analyze the body type and provide a complete outfit recommendation including top, bottom, shoes, and accessories.
    The recommendation must be highly fashionable, trending for 2025, and flattering for the specified body type.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: userPhotoBase64 ? [
      { inlineData: { data: userPhotoBase64, mimeType: 'image/jpeg' } },
      { text: prompt }
    ] : prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          occasion: { type: Type.STRING },
          explanation: { type: Type.STRING },
          trendingTip: { type: Type.STRING },
          colorPalette: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                color: { type: Type.STRING },
                brand: { type: Type.STRING },
                price: { type: Type.STRING },
                storeUrl: { type: Type.STRING },
                description: { type: Type.STRING },
                imageUrl: { type: Type.STRING }
              },
              required: ["id", "name", "type", "color", "brand", "price", "storeUrl", "description", "imageUrl"]
            }
          }
        },
        required: ["occasion", "explanation", "trendingTip", "colorPalette", "items"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse styling recommendation", e);
    throw e;
  }
};

export const virtualTryOn = async (
  userPhotoBase64: string,
  selectedItems: ClothingItem[],
  overallExplanation: string
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const itemsText = selectedItems.map(i => `${i.color} ${i.brand} ${i.name} (${i.type})`).join(", ");
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: userPhotoBase64,
            mimeType: 'image/jpeg'
          }
        },
        {
          text: `
            Act as a high-end fashion AI renderer. 
            Edit this photo to realistically show the person wearing exactly these items: ${itemsText}.
            Context: ${overallExplanation}.
            
            Strict requirements:
            1. Preserve the user's face, body proportions, hair, and the background exactly as they are.
            2. Replace only the clothing with high-fidelity, photorealistic textures for the specified items.
            3. Ensure natural lighting and shadows between the new clothing and the original person/background.
            4. Make it look like a professional studio photoshoot.
          `
        }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image part returned from Gemini");
};

export const fetchTrends = async () => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: "What are the top 5 fashion trends for 2025? Provide short summaries for each with specific item examples.",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};
