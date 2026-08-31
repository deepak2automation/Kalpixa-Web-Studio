import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function manifest():MetadataRoute.Manifest{return {name:'Kalpixa Web Studio',short_name:'Kalpixa',description:'High-performance websites, SEO, hosting and digital solutions for growing businesses.',start_url:'/',display:'standalone',background_color:'#f4f1e9',theme_color:'#07111f',icons:[{src:'/favicon.svg',sizes:'any',type:'image/svg+xml'}]};}
