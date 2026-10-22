import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",name:"edx — School, together",short_name:"edx",
    description:"School, together. A home for updates, homework, dates and school conversations.",
    start_url:"/",scope:"/",display:"standalone",
    background_color:"#f6f7fb",theme_color:"#e5f2ff",orientation:"any",
    categories:["education","productivity"],lang:"en-ZA",
    icons:[
      {src:"/icon-192.png",sizes:"192x192",type:"image/png",purpose:"any"},
      {src:"/icon-512.png",sizes:"512x512",type:"image/png",purpose:"any"},
      {src:"/maskable-icon.png",sizes:"512x512",type:"image/png",purpose:"maskable"},
    ]
  };
}
