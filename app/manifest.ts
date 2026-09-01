import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function manifest():MetadataRoute.Manifest{return {name:'Kalpixa Web Studio',short_name:'Kalpixa',description:'Website strategy, design, search, digital growth and commerce systems for growing businesses.',start_url:'/',display:'standalone',background_color:'#f7f8fb',theme_color:'#06131d',icons:[{src:'/favicon.svg',sizes:'any',type:'image/svg+xml'}]};}
