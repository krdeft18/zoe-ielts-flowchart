// Pan in the camera's screen plane. Translating eye and target equally preserves angle.
export function panOffset(dx,dy,{yaw,pitch,radius,fov=38,height}) {
 const unit=2*radius*Math.tan(fov*Math.PI/360)/Math.max(1,height);
 return {x:unit*(-dx*Math.cos(yaw)-dy*Math.sin(yaw)*Math.sin(pitch)),
 y:unit*dy*Math.cos(pitch),z:unit*(dx*Math.sin(yaw)-dy*Math.cos(yaw)*Math.sin(pitch))};
}
export function installCameraControls(canvas,{begin,orbit,pan,zoom},keys=window,zone=canvas) {
 let space=false,gesture=null,hover=false;canvas.tabIndex=0;
 const interactive=e=>e.target?.closest?.('input,textarea,select,button,a,[contenteditable="true"],[role="button"],dialog[open]');
 const down=e=>{if(e.code!=='Space')return;if(interactive(e)&&(!hover||e.target?.closest?.('input,textarea,select,[contenteditable="true"],dialog[open]')))return;e.preventDefault();space=true;canvas.style.cursor=gesture?'grabbing':'grab';};
 const up=e=>{if(e.code!=='Space')return;if(space)e.preventDefault();space=false;canvas.style.cursor=gesture?'grabbing':'';};
 const finish=()=>{const id=gesture?.id;gesture=null;canvas.style.cursor=space?'grab':'';if(id!=null&&canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);};
 const reset=()=>{space=false;finish();};
 const pointerdown=e=>{if(gesture||![0,1].includes(e.button))return;e.preventDefault();canvas.focus?.({preventScroll:true});begin();gesture={id:e.pointerId,x:e.clientX,y:e.clientY,pan:e.button===1||space};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';};
 const move=e=>{if(!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;(gesture.pan?pan:orbit)(dx,dy);gesture.x=e.clientX;gesture.y=e.clientY;};
 const end=e=>{if(gesture?.id===e.pointerId)finish();};
 const wheel=e=>{e.preventDefault();e.stopPropagation();const unit=e.deltaMode===1?16:e.deltaMode===2?(zone.clientHeight||600):1;begin();zoom(Math.max(-250,Math.min(250,e.deltaY*unit)));};
 const middle=e=>{if(e.button===1)e.preventDefault();};
 const bindings=[[canvas,'pointerenter',()=>hover=true],[canvas,'pointerleave',()=>hover=false],[keys,'keydown',down],[keys,'keyup',up],[keys,'blur',reset],[canvas,'pointerdown',pointerdown],[canvas,'pointermove',move],[canvas,'pointerup',end],[canvas,'pointercancel',end],[canvas,'lostpointercapture',end],[zone,'wheel',wheel,{passive:false,capture:true}],[canvas,'mousedown',middle],[canvas,'auxclick',middle]];
 bindings.forEach(([el,event,fn,options])=>el.addEventListener(event,fn,options));
 return ()=>{reset();bindings.forEach(([el,event,fn,options])=>el.removeEventListener(event,fn,options));};
}
