import {ease} from './shaping.js';
export const FEED={x:3.7,y:1.02,z:-2.4};
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const L1=Math.hypot(1.4,1.8),L2=Math.hypot(.3,1.9),A1=Math.atan2(1.8,-1.4),A2=Math.atan2(-1.9,-.3);
// Solve the actual two-link arm for the bucket's material anchor, not a floating proxy.
export function excavationState(p){
 const swing=ease(.43,.66,p),back=ease(.86,1,p),turn=Math.atan2(FEED.z,-(FEED.x-1.5));
 const yaw=turn*swing*(1-back),distance=(3.7+(Math.hypot(FEED.x-1.5,FEED.z)-3.7)*swing)*(1-back)+3.7*back;
 const y=(.25+1.8*ease(.18,.4,p)-.85*ease(.58,.72,p))*(1-back)+.25*back;
 const dump=-.65*ease(.65,.72,p)*(1-ease(.82,.9,p));
 const ox=-.25*Math.cos(dump)-.1*Math.sin(dump),oy=-.25*Math.sin(dump)+.1*Math.cos(dump);
 const x=-(distance-.6)-ox,h=y-1.25-oy,d2=x*x+h*h;
 const elbow=Math.acos(Math.max(-1,Math.min(1,(d2-L1*L1-L2*L2)/(2*L1*L2))));
 const theta=Math.atan2(h,x)-Math.atan2(L2*Math.sin(elbow),L1+L2*Math.cos(elbow));
 const boom=wrap(theta-A1),stick=wrap(elbow-A2+A1),bucket=wrap(dump-boom-stick);
 return {yaw,boom,stick,bucket,anchor:{x:1.5-distance*Math.cos(yaw),y,z:distance*Math.sin(yaw)}};
}
export function excavationPayload(p){
 if(p<=.72)return excavationState(p).anchor;
 const t=Math.max(0,Math.min(1,(p-.72)/.1));
 return {x:FEED.x,y:1.2-(1.2-FEED.y)*t*t,z:FEED.z};
}
export const screenTop=x=>2-Math.tan(.08)*(x+16);
// Clay follows the upper feed, crosses the screen, then falls onto the lower belt.
export function screenPayloadHeight(x){
 if(x< -17.6)return 1.02+(screenTop(-17.6)+.06-1.02)*ease(-22,-17.6,x);
 if(x<=-16.3)return screenTop(x)+.06;
 if(x< -15.8){const t=(x+16.3)/.5;return (screenTop(-16.3)+.06)*(1-t*t)+1.02*t*t;}
 return 1.02;
}
export function excavationLoadPose(p){
 const released=p>.72,pose=excavationState(released?.72:p),base=excavationPayload(p),settle=ease(.72,.82,p);
 const tilt=-.65*ease(.65,.72,p)*(1-settle),yaw=pose.yaw;
 const ox=-.15*Math.sin(tilt),oy=.15*Math.cos(tilt);
 return {x:base.x+Math.cos(yaw)*ox,y:base.y+oy,z:base.z-Math.sin(yaw)*ox,yaw,tilt};
}
