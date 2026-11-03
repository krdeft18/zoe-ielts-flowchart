import * as T from './vendor/three.js';
let texture;
export function contactShadow(width=8,depth=5){if(!texture){const n=64,data=new Uint8Array(n*n*4);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const r=((x/n-.5)*2)**2+((y/n-.5)*2)**2,i=(y*n+x)*4;data[i]=22;data[i+1]=26;data[i+2]=27;data[i+3]=Math.round(Math.max(0,1-r)**2*90)}texture=new T.DataTexture(data,n,n);texture.needsUpdate=true}const m=new T.Mesh(new T.PlaneGeometry(width,depth),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=-.025;m.renderOrder=1;return m}
