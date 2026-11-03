const smooth=(a,b,x)=>{const p=Math.max(0,Math.min(1,(x-a)/(b-a)));return p*p*(3-2*p)};
export const materialStages=['Raw clay clumps','Screened clay fragments','Crushed clay granules','Wet clay mixture','Shaped wet bricks','Dried bricks','Heated bricks','Fired hot bricks','Cooled bricks','Secured pallet'];
export function materialState(x,z){
 if(z<0){if(x< -17.45)return {id:0,color:'#765039',roughness:1};if(x< -13.5)return {id:1,color:'#886247',roughness:1};if(x< -1)return {id:2,color:'#997253',roughness:.95};if(x<14)return {id:3,color:'#77543f',roughness:.36};if(x<26)return {id:4,color:'#8e674f',roughness:.48};return {id:5,color:'#c29472',roughness:1};}
 if(x>25)return {id:5,color:'#c29472',roughness:1};if(x>12)return {id:6,color:'#bb754d',roughness:.88,glow:smooth(25,13,x)*.25};if(x>1)return {id:7,color:'#ad5838',roughness:.9,glow:.35};if(x> -16)return {id:8,color:'#ad5838',roughness:1,glow:.35*(1-smooth(1,-2,x))};return {id:9,color:'#ad5838',roughness:1};
}
export function packagingProgress(x){return smooth(-10,-17,x)}

// Thermal history follows each batch's progress, including during pauses/seeks.
const mixColor=(a,b,t)=>{const aa=parseInt(a.slice(1),16),bb=parseInt(b.slice(1),16);let c=0;for(const shift of [16,8,0])c|=Math.round(((aa>>shift)&255)*(1-t)+((bb>>shift)&255)*t)<<shift;return '#'+c.toString(16).padStart(6,'0');};
const thermalKeys=[
 {color:'#8e674f',roughness:.48,glow:0},
 {color:'#c29472',roughness:1,glow:0},
 {color:'#c2754b',roughness:.92,glow:.22},
 {color:'#e28b54',roughness:.86,glow:.85},
 {color:'#ad5838',roughness:1,glow:0}
];
export function thermalState(stage,progress){
 const i=Math.max(0,Math.min(3,stage-4)),p=smooth(.08,.92,progress),a=thermalKeys[i],b=thermalKeys[i+1];
 if(stage>=8)return {...thermalKeys[4],emissive:'#ff5d16'};
 return {color:mixColor(a.color,b.color,p),roughness:a.roughness+(b.roughness-a.roughness)*p,glow:a.glow+(b.glow-a.glow)*p,emissive:'#ff5d16'};
}
export function thermalProgress(stage,x,z){
 const clamp=p=>Math.max(0,Math.min(1,p));
 if(stage===4)return z>=0?1:clamp((x-25.4)/5.2);
 if(stage===5)return clamp((30.6-x)/5.2);
 if(stage===6)return clamp((16.6-x)/5.2);
 if(stage===7)return clamp((2.6-x)/5.2);
 return 1;
}
