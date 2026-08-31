import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { site } from '@/lib/site';
import { ContactForm } from './ContactForm';
export const metadata:Metadata={title:'Start Your Project',description:'Get a custom quote for your web design, SEO, or e-commerce project. Tell us what you need and we will guide you toward the right solution.',alternates:{canonical:'/contact'}};
export default function ContactPage(){return <main id="main-content"><PageHero eyebrow="Start Your Project" title="Let’s Build Something Great" lead="Tell us what you need and we’ll guide you toward the right solution."/><section className="contact-layout shell"><div className="contact-aside"><h2>Direct contact</h2><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a><a href={site.whatsapp}>WhatsApp →</a><hr/><h3>What Happens Next</h3><ol><li>We review your project brief and requirements.</li><li>We prepare the best next-step recommendation.</li><li>We follow up directly by email within 24 hours.</li></ol><p>No pressure, no spam.</p></div><ContactForm/></section></main>;}
