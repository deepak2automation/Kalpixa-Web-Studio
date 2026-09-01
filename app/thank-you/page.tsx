import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Request Received',
  description: 'Your project brief has been securely received by Kalpixa.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <main id="main-content" className="thank-you-page">
    <section className="thank-you-card shell">
      <div className="confirmation-mark" aria-hidden="true"><span>✓</span></div>
      <p className="eyebrow">Securely received</p>
      <h1>Brief Secured.</h1>
      <p className="page-lead">Your project details have been securely submitted to Kalpixa Web Studio. We will review the context and aim to respond within one business day.</p>
      <div className="confirmation-steps" aria-label="What happens next">
        <div><span>01</span><strong>Review the brief</strong><p>We review your project brief and requirements.</p></div>
        <div><span>02</span><strong>Prepare a recommendation</strong><p>We prepare the best next-step recommendation for your goals.</p></div>
        <div><span>03</span><strong>Direct follow-up</strong><p>We aim to reply by email within one business day; complex briefs may take longer.</p></div>
      </div>
      <div className="hero-actions"><a className="button" href="/">Return to Home</a><a className="text-link" href="/services/">Explore Services →</a></div>
    </section>
    <CtaBand title="Need to add context before we reply?"/>
  </main>;
}
