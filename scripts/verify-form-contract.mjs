import { readFile } from 'node:fs/promises';
const [client,blueprint]=await Promise.all([readFile(new URL('../app/contact/ContactForm.tsx',import.meta.url),'utf8'),readFile(new URL('../public/__forms.html',import.meta.url),'utf8')]);
const fields=['form-name','name','email','phone','service','message','consent','bot-field'];
const failures=[];
for(const field of fields){if(!client.includes(`name="${field}"`))failures.push(`client missing ${field}`);if(!blueprint.includes(`name="${field}"`))failures.push(`blueprint missing ${field}`);}
if(!client.includes('data-netlify="true"')||!blueprint.includes('data-netlify="true"'))failures.push('Netlify detection attribute missing');
if(!client.includes('data-netlify-honeypot="bot-field"')||!blueprint.includes('data-netlify-honeypot="bot-field"'))failures.push('honeypot contract missing');
for(const option of ['Website','SEO','Ecommerce','Other']){if(!client.includes(`'${option}'`))failures.push(`client missing original service option ${option}`);if(!blueprint.includes(`<option>${option}</option>`))failures.push(`blueprint missing original service option ${option}`);}
for(const source of [client,blueprint]){if(!source.includes('name="contact"'))failures.push('stable contact form name missing');if(!source.includes('action="/thank-you/"'))failures.push('confirmation action missing');}
console.log(JSON.stringify({form:'contact',fields:fields.length,failures},null,2));if(failures.length)process.exitCode=1;
