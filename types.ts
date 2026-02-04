
export type BodyType = 'Pear' | 'Hourglass' | 'Rectangle' | 'Inverted Triangle' | 'Apple' | 'Athletic';

export interface UserProfile {
  name: string;
  bodyType?: BodyType;
  stylePreferences: string[];
  measurements?: {
    height: string;
    weight: string;
  };
  photoUrl?: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: string;
  brand: string;
  price: string;
  storeUrl: string;
  description: string;
  imageUrl: string;
}

export interface OutfitRecommendation {
  occasion: string;
  explanation: string;
  items: ClothingItem[];
  colorPalette: string[];
  trendingTip: string;
}

export interface StyleFeedItem {
  id: string;
  title: string;
  image: string;
  tag: string;
  description: string;
}
