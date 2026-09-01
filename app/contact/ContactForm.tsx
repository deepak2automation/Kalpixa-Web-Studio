'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateProjectForm } from '@/lib/form-validation.mjs';

type ErrorKey = 'form' | 'name' | 'company' | 'email' | 'phone' | 'website' | 'service' | 'timeline' | 'budget' | 'message' | 'consent';
type Errors = Partial<Record<ErrorKey, string>>;

const formName = 'contact';
const serviceOptions = ['Website & Platform', 'SEO & Content', 'Digital Marketing', 'E-Commerce', 'Analytics & Tracking', 'Other'];

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setErrors({});

    const form = event.currentTarget;
    const result = validateProjectForm(Object.fromEntries(new FormData(form)));
    if (!result.ok) {
      setErrors(result.errors);
      setStatus('error');
      setMessage(result.errors.form ?? 'Please review the highlighted fields.');
      const first = Object.keys(result.errors).find((key) => key !== 'form');
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    const body = new URLSearchParams({ 'form-name': formName, ...result.data }).toString();

    try {
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, signal: controller.signal });
      if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
      form.reset();
      setStatus('success');
      setMessage('Your project brief has been securely received. Opening your confirmation…');
      window.sessionStorage.setItem('kalpixa:submitted', 'true');
      window.setTimeout(() => router.push('/thank-you/'), 350);
    } catch {
      setStatus('error');
      setMessage('We could not confirm delivery. Please email deepak@kalpixa.com or call +91 79000 71164.');
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return <form className="contact-form" name="contact" method="POST" action="/thank-you/" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} aria-describedby="form-note" noValidate>
    <input type="hidden" name="form-name" value="contact"/>
    <div className="trap" aria-hidden="true"><label>Do not fill this out<input name="bot-field" tabIndex={-1} autoComplete="off"/></label></div>
    <fieldset className="service-choice"><legend>What do you need help with? <b aria-hidden="true">*</b></legend><div>{serviceOptions.map((option, index) => <label key={option}><input type="radio" name="service" value={option} defaultChecked={index === 0} required/><span>{option}</span></label>)}</div>{errors.service && <small className="field-error">{errors.service}</small>}</fieldset>
    <div className="form-section-heading"><span>01</span><div><strong>Project context</strong><small>A short brief helps us prepare a useful first response.</small></div></div>
    <label className="field"><span>Tell us about the project and the outcome you need. <b aria-hidden="true">*</b></span><textarea name="message" rows={7} required minLength={20} maxLength={3000} placeholder="What needs to change, who is it for, and what would success look like?" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <small className="field-error" id="message-error">{errors.message}</small>}</label>
    <div className="field-grid">
      <Field label="Company or brand (optional)" name="company" autoComplete="organization" error={errors.company}/>
      <Field label="Current website (optional)" name="website" type="url" autoComplete="url" placeholder="example.com" error={errors.website}/>
      <SelectField label="Preferred timeline (optional)" name="timeline" error={errors.timeline} options={['Within 4 weeks', '1–3 months', '3–6 months', 'Exploring']}/>
      <SelectField label="Indicative budget (optional)" name="budget" error={errors.budget} options={['Under ₹50,000', '₹50,000–₹1,50,000', '₹1,50,000–₹5,00,000', '₹5,00,000+', 'Not sure']}/>
    </div>
    <div className="form-section-heading"><span>02</span><div><strong>How should we reach you?</strong><small>Only the details needed to respond to this enquiry.</small></div></div>
    <div className="field-grid">
      <Field label="Your name" name="name" autoComplete="name" required error={errors.name}/>
      <Field label="Email address" name="email" type="email" autoComplete="email" required error={errors.email}/>
      <Field label="Phone number (optional)" name="phone" type="tel" autoComplete="tel" error={errors.phone}/>
    </div>
    <label className="consent"><input type="checkbox" name="consent" value="yes" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined}/><span>I agree that Kalpixa Web Studio may use this information to respond to my enquiry. See the <a href="/privacy/">privacy notice</a>.</span></label>
    {errors.consent && <small className="field-error" id="consent-error">{errors.consent}</small>}
    <p id="form-note" className="form-note">Required fields are marked *. Do not include passwords, payment details or sensitive personal data.</p>
    {message && <div className={`form-status ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{message}</div>}
    <button className="button" type="submit" disabled={status === 'sending' || status === 'success'}>{status === 'sending' ? 'Sending securely…' : status === 'success' ? 'Brief received' : 'Send Project Brief'} <span aria-hidden="true">→</span></button>
  </form>;
}

function Field({ label, name, type = 'text', autoComplete, placeholder, required = false, error }: { label: string; name: string; type?: string; autoComplete?: string; placeholder?: string; required?: boolean; error?: string }) {
  return <label className="field"><span>{label} {required && <b aria-hidden="true">*</b>}</span><input name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} required={required} maxLength={type === 'email' ? 254 : type === 'url' ? 300 : 120} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}/>{error && <small className="field-error" id={`${name}-error`}>{error}</small>}</label>;
}

function SelectField({ label, name, options, error }: { label: string; name: string; options: string[]; error?: string }) {
  return <label className="field"><span>{label}</span><select name={name} defaultValue="" aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}><option value="">Select an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{error && <small className="field-error" id={`${name}-error`}>{error}</small>}</label>;
}
