import { readFile } from 'node:fs/promises';
const [client,blueprint]=await Promise.all([readFile(new URL('../app/contact/ContactForm.tsx',import.meta.url),'utf8'),readFile(new URL('../public/__forms.html',import.meta.url),'utf8')]);
const fields=['form-name','name','company','email','phone','website','service','timeline','budget','message','consent','bot-field'];
const failures=[];
for(const field of fields){if(!client.includes(`name="${field}"`))failures.push(`client missing ${field}`);if(!blueprint.includes(`name="${field}"`))failures.push(`blueprint missing ${field}`);}
if(!client.includes('data-netlify="true"')||!blueprint.includes('data-netlify="true"'))failures.push('Netlify detection attribute missing');
if(!client.includes('data-netlify-honeypot="bot-field"')||!blueprint.includes('data-netlify-honeypot="bot-field"'))failures.push('honeypot contract missing');
const options=[['Website & Platform','Website &amp; Platform'],['SEO & Content','SEO &amp; Content'],['Digital Marketing','Digital Marketing'],['E-Commerce','E-Commerce'],['Analytics & Tracking','Analytics &amp; Tracking'],['Other','Other']];
for(const [clientOption,blueprintOption] of options){if(!client.includes(`'${clientOption}'`))failures.push(`client missing service option ${clientOption}`);if(!blueprint.includes(`<option>${blueprintOption}</option>`))failures.push(`blueprint missing service option ${clientOption}`);}
for(const source of [client,blueprint]){if(!source.includes('name="contact"'))failures.push('stable contact form name missing');if(!source.includes('action="/thank-you/"'))failures.push('confirmation action missing');}
console.log(JSON.stringify({form:'contact',fields:fields.length,failures},null,2));if(failures.length)process.exitCode=1;
