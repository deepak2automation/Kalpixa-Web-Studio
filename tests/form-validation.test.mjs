import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProjectForm } from '../lib/form-validation.mjs';

const valid = { name: 'Deepak Kumar', email: 'deepak@example.com', phone: '+91 79000 71164', service: 'Website', message: 'We need a complete website repositioning and rebuild.', consent: 'yes', 'bot-field': '' };

test('accepts and normalizes a valid enquiry', () => {
  const result = validateProjectForm({ ...valid, name: '  Deepak   Kumar  ', email: 'DEEPAK@EXAMPLE.COM' });
  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Deepak Kumar');
  assert.equal(result.data.email, 'deepak@example.com');
});
test('accepts every original service option', () => { for (const service of ['Website', 'SEO', 'Ecommerce', 'Other']) assert.equal(validateProjectForm({ ...valid, service }).ok, true); });
test('rejects missing required fields', () => { const result = validateProjectForm({}); assert.equal(result.ok, false); assert.deepEqual(Object.keys(result.errors).sort(), ['consent', 'email', 'message', 'name', 'service'].sort()); });
test('rejects invalid email and phone', () => { const result = validateProjectForm({ ...valid, email: 'invalid', phone: 'abc' }); assert.ok(result.errors.email); assert.ok(result.errors.phone); });
test('rejects options outside the original allow list', () => { const result = validateProjectForm({ ...valid, service: 'Injected' }); assert.ok(result.errors.service); });
test('rejects a short message and missing consent', () => { const result = validateProjectForm({ ...valid, message: 'Too short', consent: '' }); assert.ok(result.errors.message); assert.ok(result.errors.consent); });
test('rejects honeypot submissions', () => { const result = validateProjectForm({ ...valid, 'bot-field': 'https://spam.invalid' }); assert.equal(result.ok, false); assert.equal(result.errors.form, 'Submission rejected.'); });
