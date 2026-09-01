import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { site } from '@/lib/site';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = { title: 'Start Your Project', description: 'Tell Kalpixa Web Studio about your website, SEO, marketing, analytics or e-commerce project.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return <main id="main-content">
    <PageHero eyebrow="Start your project" title="Bring the ambition. We’ll help structure the next move." lead="Share the context, constraints and outcome you need. You will receive a direct, practical response—not an automated sales sequence." image="contact"/>
    <section className="contact-layout shell">
      <aside className="contact-aside"><p className="eyebrow eyebrow-light">Direct contact</p><h2>Choose the channel that works for you.</h2><div className="contact-methods"><article><span>01</span><div><small>Written enquiries</small><strong>Email</strong><a href={site.emailEnquiry}>{site.email} ↗</a></div></article><article><span>02</span><div><small>Direct conversation</small><strong>Phone</strong><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay} ↗</a></div></article><article><span>03</span><div><small>Quick context</small><strong>WhatsApp</strong><a href={site.whatsapp} target="_blank" rel="noreferrer">Open a prepared chat ↗</a></div></article></div><div className="response-note"><strong>Response goal</strong><p>We aim to respond within one business day. Timing can vary with enquiry volume and project complexity.</p></div><div className="privacy-note"><strong>Handled with care</strong><p>Your brief is used to respond to this enquiry. Please do not send passwords, payment details or sensitive personal data.</p></div></aside>
      <div className="contact-form-panel"><div className="contact-form-intro"><p className="eyebrow">Project brief</p><h2>Give us enough context to be useful.</h2><p>The structure below is inspired by strong enterprise enquiry workflows: clear routing, useful context, consent and an explicit delivery state.</p></div><ContactForm/></div>
    </section>
  </main>;
}
