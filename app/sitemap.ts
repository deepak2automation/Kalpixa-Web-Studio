import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
const routes=['','/services','/services/websites','/services/seo','/services/care','/work','/about','/insights','/insights/website-brief','/contact','/privacy','/terms','/cookies','/accessibility','/security'];
export default function sitemap():MetadataRoute.Sitemap{const lastModified=new Date('2026-08-28');return routes.map(route=>({url:`https://kalpixa.com${route}`,lastModified,changeFrequency:route===''?'weekly':'monthly',priority:route===''?1:route==='/contact'?0.9:0.7}));}
