import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProjectForm } from '../lib/form-validation.mjs';

const valid = { name: 'Deepak Kumar', company: 'Kalpixa', email: 'deepak@example.com', phone: '+91 79000 71164', website: 'kalpixa.com', service: 'Website & Platform', timeline: '1–3 months', budget: '₹50,000–₹1,50,000', message: 'We need a complete website repositioning and rebuild.', consent: 'yes', 'bot-field': '' };

test('accepts and normalizes a valid enquiry', () => { const result = validateProjectForm({ ...valid, name: '  Deepak   Kumar  ', email: 'DEEPAK@EXAMPLE.COM' }); assert.equal(result.ok, true); assert.equal(result.data.name, 'Deepak Kumar'); assert.equal(result.data.email, 'deepak@example.com'); assert.equal(result.data.website, 'https://kalpixa.com/'); });
test('accepts every supported service option', () => { for (const service of ['Website & Platform', 'SEO & Content', 'Digital Marketing', 'E-Commerce', 'Analytics & Tracking', 'Other']) assert.equal(validateProjectForm({ ...valid, service }).ok, true); });
test('accepts empty optional project fields', () => { const result = validateProjectForm({ ...valid, company: '', website: '', timeline: '', budget: '', phone: '' }); assert.equal(result.ok, true); });
test('rejects missing required fields', () => { const result = validateProjectForm({}); assert.equal(result.ok, false); assert.deepEqual(Object.keys(result.errors).sort(), ['consent', 'email', 'message', 'name', 'service'].sort()); });
test('rejects invalid email, phone and website', () => { const result = validateProjectForm({ ...valid, email: 'invalid', phone: 'abc', website: 'not a website' }); assert.ok(result.errors.email); assert.ok(result.errors.phone); assert.ok(result.errors.website); });
test('rejects options outside allow lists', () => { const result = validateProjectForm({ ...valid, service: 'Injected', timeline: 'Yesterday', budget: 'Unlimited' }); assert.ok(result.errors.service); assert.ok(result.errors.timeline); assert.ok(result.errors.budget); });
test('rejects URL credentials and non-http protocols', () => { assert.ok(validateProjectForm({ ...valid, website: 'https://user:pass@example.com' }).errors.website); assert.ok(validateProjectForm({ ...valid, website: 'javascript:alert(1)' }).errors.website); });
test('rejects a short message and missing consent', () => { const result = validateProjectForm({ ...valid, message: 'Too short', consent: '' }); assert.ok(result.errors.message); assert.ok(result.errors.consent); });
test('rejects honeypot submissions', () => { const result = validateProjectForm({ ...valid, 'bot-field': 'https://spam.invalid' }); assert.equal(result.ok, false); assert.equal(result.errors.form, 'Submission rejected.'); });
