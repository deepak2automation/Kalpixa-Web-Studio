import { Globe, BarChart3, Rocket, Smartphone, ShieldCheck, Palette } from 'lucide-react';
import { NavItem, Service } from './types';

export const BRAND_NAME = "Kalpixa";
export const PHONE_NUMBER = "+917900071164";
export const CONTACT_EMAIL = "deepak@kalpixa.com";
export const WHATSAPP_LINK = "https://wa.me/917900071164";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'SEO Analyzer', path: '/seo-tools' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Custom Web Design',
    description: 'Bespoke, high-performance websites tailored to your brand identity. We build digital experiences, not just pages.',
    icon: Palette,
    price: 'From ₹25,000'
  },
  {
    id: '2',
    title: 'SEO & Visibility',
    description: 'Dominate local search results. We optimize your structure and content to get you to the top of Google.',
    icon: BarChart3,
    price: 'From ₹10,000/mo'
  },
  {
    id: '3',
    title: 'High-Speed Hosting',
    description: 'Lightning fast load times with our managed hosting solutions. Security and SSL included standard.',
    icon: Rocket,
    price: '₹5,000/yr'
  },
  {
    id: '4',
    title: 'Mobile App Development',
    description: 'Extend your reach with native iOS and Android applications connected seamlessly to your backend.',
    icon: Smartphone,
    price: 'Custom Quote'
  },
  {
    id: '5',
    title: 'Cyber Security',
    description: 'Protect your customer data with enterprise-grade firewalls and regular security audits.',
    icon: ShieldCheck,
    price: 'included'
  },
  {
    id: '6',
    title: 'E-Commerce Solutions',
    description: 'Full-featured online stores with payment gateways, inventory management, and automated logistics.',
    icon: Globe,
    price: 'From ₹45,000'
  }
];
