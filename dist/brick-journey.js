// One persistent batch/brick identity, tied to the lesson clock. No modulo or respawn.
export const TRACKED_BRICK_ID='brick-001';
const clamp=n=>Math.max(0,Math.min(1,n));
export function createBrickJourney(route) {
 const points=Array.from({length:2401},(_,i)=>route.getPointAt(i/2400));
 function at(x,z){let best=0,distance=Infinity;points.forEach((p,i)=>{const d=(p.x-x)**2+(p.z-z)**2;if(d<distance){best=i;distance=d;}});let lo=Math.max(0,(best-1)/2400),hi=Math.min(1,(best+1)/2400);const distanceAt=q=>{const p=route.getPointAt(q);return (p.x-x)**2+(p.z-z)**2;};for(let j=0;j<45;j++){const a=lo+(hi-lo)/3,b=hi-(hi-lo)/3;if(distanceAt(a)<distanceAt(b))hi=b;else lo=a;}return (lo+hi)/2;}
 const stops=[0,0,at(-4,-7),at(10,-7),at(20,-7),at(32,7),at(19,7),at(5,7),at(-9,7),at(-20,7),at(-27,7)];
 return {stops,sample(index,progress){const p=clamp(progress),stage=Math.max(0,Math.min(9,index));const t=stage===9?clamp(p/.4):p;
 return {id:TRACKED_BRICK_ID,index:stage,progress:p,q:stops[stage]+(stops[stage+1]-stops[stage])*t,truckOffset:stage===9?6*clamp((p-.58)/.42):0};}};
}

// Every chain batch uses this same clock and offset. Tracking is only a view state.
export function chainPhase(time,offset=0){
 const age=Math.max(0,time+offset),cycle=150;
 const t=age>0&&age%cycle===0?cycle:age%cycle;
 const index=Math.min(9,Math.floor(t/15));return {index,progress:(t-index*15)/15};
}
