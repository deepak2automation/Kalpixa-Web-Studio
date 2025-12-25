import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: string;
}

export interface SeoResult {
  score: number;
  url: string;
  title: string;
  description: string;
  loadingSpeed: number;
  mobileFriendly: boolean;
  socialImage: string;
}

export enum PageState {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  SEO_TOOLS = 'SEO_TOOLS',
  CONTACT = 'CONTACT',
}

export interface PageProps {
  navigate: (path: string) => void;
}
