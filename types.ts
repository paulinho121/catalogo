
export enum AppView {
  HOME = 'HOME',
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  ADMIN = 'ADMIN',
  REGISTER = 'REGISTER',
  CATALOG = 'CATALOG',
  HISTORY = 'HISTORY'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isAudio?: boolean;
  citations?: string[];
}

export interface CatalogDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: Date;
  status: 'indexed' | 'processing' | 'error';
  pages?: number;
}

export interface ProductReference {
  id: string;
  name: string;
  sku: string;
  description: string;
  specs: Record<string, string>;
  imageUrl?: string;
  category: string;
  isFavorite?: boolean;
}
