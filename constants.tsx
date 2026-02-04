
import React from 'react';
import { 
  Camera, 
  User, 
  Sparkles, 
  ShoppingBag, 
  Layout, 
  Heart, 
  Settings,
  PlusCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'feed', name: 'For You', icon: <Layout className="w-5 h-5" /> },
  { id: 'stylist', name: 'AI Stylist', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'wardrobe', name: 'Wardrobe', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
];

export const STYLE_OPTIONS = [
  'Minimalist', 'Bohemian', 'Streetwear', 'Classic Preppy', 
  'Grunge', 'Cyberpunk', 'High Fashion', 'Business Casual',
  'Athleisure', 'Vintage'
];

export const OCCASIONS = [
  'Job Interview', 'First Date', 'Summer Brunch', 
  'Cocktail Party', 'Workout Session', 'Office Day',
  'Wedding Guest', 'Casual Weekend'
];
