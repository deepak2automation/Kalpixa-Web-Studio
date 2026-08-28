import { readFile } from 'node:fs/promises';
const [client,blueprint]=await Promise.all([readFile(new URL('../app/contact/ContactForm.tsx',import.meta.url),'utf8'),readFile(new URL('../public/__forms.html',import.meta.url),'utf8')]);
const fields=['form-name','name','email','phone','company','service','budget','timeline','message','consent','website'];
const failures=[];
for(const field of fields){if(!client.includes(`name="${field}"`))failures.push(`client missing ${field}`);if(!blueprint.includes(`name="${field}"`))failures.push(`blueprint missing ${field}`);}
if(!client.includes('data-netlify="true"')||!blueprint.includes('data-netlify="true"'))failures.push('Netlify detection attribute missing');
if(!client.includes('data-netlify-honeypot="website"')||!blueprint.includes('data-netlify-honeypot="website"'))failures.push('honeypot contract missing');
console.log(JSON.stringify({form:'kalpixa-project',fields:fields.length,failures},null,2));if(failures.length)process.exitCode=1;
