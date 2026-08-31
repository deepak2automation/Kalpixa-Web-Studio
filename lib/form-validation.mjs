const services = new Set(['Website', 'SEO', 'Ecommerce', 'Other']);
const clean = (value, max) => typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ').slice(0, max) : '';

/** @param {Record<string, unknown>} input */
export function validateProjectForm(input) {
  /** @type {Record<string,string>} */
  const errors = {};
  const name = clean(input.name, 100);
  const email = clean(input.email, 254).toLowerCase();
  const phone = clean(input.phone, 30);
  const service = clean(input.service, 40);
  const message = clean(input.message, 3000);
  const botField = clean(input['bot-field'], 120);
  const consent = input.consent === 'yes' || input.consent === true;

  if (botField) errors.form = 'Submission rejected.';
  if (name.length < 2) errors.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) errors.email = 'Enter a valid email address.';
  if (phone && !/^[+\d][\d\s().-]{6,28}$/u.test(phone)) errors.phone = 'Enter a valid phone number or leave it blank.';
  if (!services.has(service)) errors.service = 'Choose a service.';
  if (message.length < 20) errors.message = 'Tell us a little more (at least 20 characters).';
  if (!consent) errors.consent = 'Consent is required so we can respond.';

  return { ok: Object.keys(errors).length === 0, errors, data: { name, email, phone, service, message, consent: consent ? 'yes' : '', 'bot-field': botField } };
}
