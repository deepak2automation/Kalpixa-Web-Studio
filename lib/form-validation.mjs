const services = new Set(['Website & Platform', 'SEO & Content', 'Digital Marketing', 'E-Commerce', 'Analytics & Tracking', 'Other']);
const timelines = new Set(['', 'Within 4 weeks', '1–3 months', '3–6 months', 'Exploring']);
const budgets = new Set(['', 'Under ₹50,000', '₹50,000–₹1,50,000', '₹1,50,000–₹5,00,000', '₹5,00,000+', 'Not sure']);
const clean = (value, max) => typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ').slice(0, max) : '';

function normalizeWebsite(value) {
  const input = clean(value, 300);
  if (!input) return { value: '' };
  try {
    const parsed = new URL(/^https?:\/\//iu.test(input) ? input : `https://${input}`);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || !parsed.hostname.includes('.')) throw new Error('Invalid URL');
    return { value: parsed.toString() };
  } catch {
    return { value: input, error: 'Enter a complete website address, such as example.com.' };
  }
}

/** @param {Record<string, unknown>} input */
export function validateProjectForm(input) {
  /** @type {Record<string,string>} */
  const errors = {};
  const name = clean(input.name, 100);
  const company = clean(input.company, 120);
  const email = clean(input.email, 254).toLowerCase();
  const phone = clean(input.phone, 30);
  const service = clean(input.service, 60);
  const timeline = clean(input.timeline, 40);
  const budget = clean(input.budget, 50);
  const message = clean(input.message, 3000);
  const websiteResult = normalizeWebsite(input.website);
  const botField = clean(input['bot-field'], 120);
  const consent = input.consent === 'yes' || input.consent === true;

  if (botField) errors.form = 'Submission rejected.';
  if (name.length < 2) errors.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) errors.email = 'Enter a valid email address.';
  if (phone && !/^[+\d][\d\s().-]{6,28}$/u.test(phone)) errors.phone = 'Enter a valid phone number or leave it blank.';
  if (!services.has(service)) errors.service = 'Choose a service.';
  if (!timelines.has(timeline)) errors.timeline = 'Choose a valid timeline.';
  if (!budgets.has(budget)) errors.budget = 'Choose a valid budget range.';
  if (websiteResult.error) errors.website = websiteResult.error;
  if (message.length < 20) errors.message = 'Tell us a little more (at least 20 characters).';
  if (!consent) errors.consent = 'Consent is required so we can respond.';

  return { ok: Object.keys(errors).length === 0, errors, data: { name, company, email, phone, website: websiteResult.value, service, timeline, budget, message, consent: consent ? 'yes' : '', 'bot-field': botField } };
}
