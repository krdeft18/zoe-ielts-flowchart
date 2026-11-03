import * as T from './vendor/three.js';
const maps={};let anisotropy=1;
export function configureTexture(t){t.wrapS=t.wrapT=T.RepeatWrapping;t.generateMipmaps=true;t.minFilter=T.LinearMipmapLinearFilter;t.magFilter=T.LinearFilter;t.anisotropy=anisotropy;return t;}
export function configureSurfaceQuality(maxAnisotropy){anisotropy=Math.max(1,Math.min(16,maxAnisotropy));Object.values(maps).forEach(t=>{t.anisotropy=anisotropy;t.needsUpdate=true;});}
function texture(kind){if(maps[kind])return maps[kind];const size=512,data=new Uint8Array(size*size*4);let seed=241;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=seed/4294967296;let v;
  if(kind==='metal')v=218+n*15+Math.sin(y*2.6)*7;
  else if(kind==='rubber')v=145+n*15+((x%16<2)?10:0);
  else if(kind==='wood')v=185+22*Math.sin(y*.14+Math.sin(x*.018)*2)+n*14;
  else if(kind==='clay'){const pore=n<.035?-48:0;v=223+Math.sin(x*.32)*Math.sin(y*.37)*5+n*17+pore;}
  else v=215+n*25+7*Math.sin(x*.07)*Math.sin(y*.09);
  const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=Math.max(0,Math.min(255,v));data[i+3]=255;
 }
 const t=configureTexture(new T.DataTexture(data,size,size));t.repeat.set(2,2);t.needsUpdate=true;maps[kind]=t;return t;
}
export function industrialMaterial(color){const metals=['#63766f','#a2b4a7','#d6dfd5','#7b8d7e','#c0cbbb','#c6d4c4','#849683','#526a5c'];const earth=['#94704e','#ac8966','#be6944','#ad8966','#92714f','#bd704b','#77543f','#8e674f','#c29472','#bb754d','#ad5838'];const wood=['#b99a71','#957950'];const kind=metals.includes(color)?'metal':earth.includes(color)?'clay':wood.includes(color)?'wood':['#35443f','#35413b','#3d514a','#546c5d'].includes(color)?'rubber':'concrete';const material=new T.MeshPhysicalMaterial({clearcoat:kind==='metal'?.22:0,clearcoatRoughness:.35,color:kind==='metal'?'#939fa3':color,map:texture(kind),bumpMap:texture(kind),bumpScale:kind==='metal'?.003:kind==='clay'?.009:.007,roughness:kind==='metal'?.26:kind==='clay'?.94:.76,metalness:kind==='metal'?.72:0});material.userData.surfaceKind=kind;return material;}
