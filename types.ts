export enum Category {
  HOME = 'Principais',
  POLITICS = 'Política',
  ECONOMY = 'Economia',
  SPORTS = 'Esporte',
  INTERNATIONAL = 'Mundo',
  GOSPEL = 'Gospel/Cristã',
  GOSSIP = 'Famosos & Fofoca',
  TECH = 'Tecnologia'
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedTime?: string;
  summary?: string; // The AI generated summary (600-700 chars)
  isLoadingSummary?: boolean;
}

export interface UserSettings {
  email: string;
  emailTime: string; // HH:mm
  subscribedCategories: Category[];
  whatsAppNumber: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  email: '',
  emailTime: '07:00',
  subscribedCategories: [Category.HOME, Category.POLITICS, Category.GOSPEL, Category.GOSSIP],
  whatsAppNumber: ''
};