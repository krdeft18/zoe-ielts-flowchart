// Pure normalized-time choreography shared by the factory, close-ups and captions.
export const ease=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*t*(t*(t*6-15)+10)};
export function shapingState(p){return {
 feed:ease(0,.28,p),form:ease(.38,.6,p),release:ease(.76,1,p),
 tool:ease(.28,.38,p)*(1-ease(.6,.72,p))
}}
// The batch cannot depart while the tool is still down.
export function shapingTravel(p){return 4*ease(0,.28,p)+6*ease(.78,1,p)}
export function shapingToolPose(p,branch='mould'){
 const s=shapingState(p);
 const wireStroke=ease(.3,.48,p)*(1-ease(.6,.72,p));
 return {y:branch==='wire'?2.1-.97*wireStroke:2.5-1.21*s.tool,
  mouldLift:1-ease(.68,.76,p),compression:.1*s.tool};
}
export function shapingAction(p,branch='mould'){
 const index=p<.28?0:p<(branch==='wire'?.48:.38)?1:p<.6?2:p<.76?3:4;
 const text=branch==='wire'?[
  'Wet clay feeds in and consolidates into a rectangular slab.',
  'The batch stops. Tensioned wires descend through the clay.',
  'Wires pass through the full depth, dividing nine equal bricks.',
  'The wire frame lifts completely clear of the cut bricks.',
  'Small gaps open and the separated wet bricks leave for drying.'
 ]:[
  'Soft clay feeds into the open nine-cavity mould.',
  'The batch settles. The press lowers onto the clay.',
  'Compression fills the cavities and defines the brick edges.',
  'The press lifts; the mould dividers lower to release the bricks.',
  'The formed bricks separate gently and travel toward drying.'
 ];
 return {index,total:5,text:text[index]};
}
export function tilePose(k,p,branch='mould'){
 const s=shapingState(p),col=k%3-1,row=Math.floor(k/3)-1;
 const wire=branch==='wire',compression=wire?0:.1*s.tool;
 // Wire cutting starts with a joined slab. Moulding retains soft contours
 // until the press contacts the clay. No mesh swaps or zero-scale frames.
 const joined=wire?s.feed*(1-ease(.48,.6,p)):0;
 return {x:col*(.36+.12*s.feed+.004*s.form+.056*s.release),
  y:.02+.1*(1-compression),z:row*(.25+.05*s.feed+.004*s.form+.056*s.release),
  sx:1+.035*joined,sy:1-compression,sz:1+.05*joined,
  morph:wire?1-s.feed:1-s.form};
}
