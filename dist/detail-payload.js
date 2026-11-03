import * as T from './vendor/three.js';
import {clayGeometry} from './clay-geometry.js';
import {industrialMaterial} from './surfaces.js';
import {ease,tilePose} from './shaping.js';
import {excavationState,excavationPayload,screenPayloadHeight} from './loading.js';
import {thermalState} from './material-flow.js';
export function buildDetailPayload(index,sceneRoot){
 if(index===3)return null; // Shaping already uses the common nine-tile model.
 const root=new T.Group();root.name='detail-batch';root.userData.detailBatch=true;
 const material=industrialMaterial('#ad8966'),geometry=clayGeometry(),tiles=[];
 for(let k=0;k<9;k++){const tile=new T.Mesh(geometry,material);tile.name=`detail-brick-${k+1}`;tile.castShadow=true;tile.receiveShadow=true;root.add(tile);tiles.push(tile);}
 const wood=index>=8?industrialMaterial('#b99a71'):null,strapMat=index>=8?industrialMaterial('#35443f'):null,steel=index===8?industrialMaterial('#63766f'):null;
 const pallet=new T.Group(),straps=new T.Group();pallet.name='detail-pallet';straps.name='detail-straps';
 const box=(parent,x,y,z,w,h,d,mat)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
 if(index>=8){for(let n=0;n<4;n++)box(pallet,0,-.04,(n-1.5)*.22,1.8,.08,.19,wood);for(const x of [-.52,.52])box(straps,x,.31,0,.045,.7,.48,strapMat);}
 let head=null;
 if(index===8){sceneRoot.add(pallet);root.add(straps);for(const x of [-1.4,1.4])for(const z of [-.8,.8])box(sceneRoot,x,1.75,z,.1,3.5,.1,steel);box(sceneRoot,0,3.45,0,3,.15,1.7,steel);head=box(sceneRoot,0,2.3,0,1.7,.12,.8,steel);head.name='detail-palletizer-head';}
 if(index===9){const truck=sceneRoot.getObjectByName('delivery-truck');truck.add(root);root.add(pallet,straps);}else sceneRoot.add(root);
 return {root,tiles,update(p){
  root.position.set(0,1.02,0);root.rotation.set(0,0,0);root.scale.setScalar(1);
  let morph=index<3?1:0,compact=1,grain=1,pack=index===9?1:0;
  material.color.set(index<3?'#94704e':'#ad5838');material.emissive.set('#ff5d16');material.emissiveIntensity=0;material.roughness=1;
  if(index===0){const point=excavationPayload(p),arm=excavationState(Math.min(.72,p));root.position.set(point.x+.7*ease(.86,1,p),point.y,point.z);root.rotation.set(0,arm.yaw*(1-ease(.82,1,p)),-.65*ease(.65,.72,p)*(1-ease(.72,.82,p)));compact=.55+.45*ease(.82,1,p);grain=1.15;}
  if(index===1){const x=-6.2+10*ease(0,1,p);root.position.set(x,screenPayloadHeight(x-14),0);grain=1.15-.65*ease(-3.6,-3.15,x)-.2*ease(.5,1.8,x);material.color.set('#94704e').lerp(new T.Color('#997253'),ease(-3.6,1.8,x));}
  if(index===2){const blend=ease(.18,.75,p);root.position.x=-3+3*ease(0,.2,p)+3.4*ease(.8,1,p);grain=.3+.7*blend;material.color.set('#997253').lerp(new T.Color('#77543f'),blend);material.roughness=1-.64*blend;}
  if(index>=4&&index<=7){root.position.x=-4+4*ease(0,.22,p)+4*ease(.78,1,p);const state=thermalState(index,ease(.22,.78,p));material.color.set(state.color);material.roughness=state.roughness;material.emissiveIntensity=state.glow;}
  if(index===8){root.position.x=-4+4*ease(0,.22,p)+4*ease(.85,1,p);pack=ease(.22,.76,p);pallet.position.set(4*ease(.85,1,p),1.02,0);straps.scale.set(1,Math.max(.001,ease(.76,.84,p)),1);straps.visible=p>=.76;head.position.set(0,2.3-.55*Math.sin(Math.PI*pack),0);}
  if(index===9){root.position.set(-1,1,1.9*(1-ease(0,.4,p)));const truck=sceneRoot.getObjectByName('delivery-truck'),forklift=sceneRoot.getObjectByName('delivery-forklift');truck.position.x=6*ease(.58,1,p);if(forklift){forklift.position.z=p<=.4?root.position.z+1.1:1.1+2*ease(.4,.58,p);forklift.visible=p<.6;}straps.visible=true;}
  tiles.forEach((tile,k)=>{const pose=tilePose(k,index<3?0:1),row=Math.floor(k/3),placement=ease(0,1,(pack-row*.22)/.34);
   tile.visible=true;tile.morphTargetInfluences[0]=morph;tile.scale.set(grain*compact,grain*compact,grain*compact);
   tile.position.set(pose.x*compact,pose.y+row*.22*placement+Math.sin(placement*Math.PI)*.16+(index===0?.03*(1-ease(.82,1,p)):0),pose.z*compact*(1-placement));
   if(index===2){const stirring=ease(.18,.3,p)*(1-ease(.7,.8,p));tile.position.x+=Math.sin(p*30+k)*.08*stirring;tile.position.z+=Math.cos(p*30+k)*.08*stirring;}
  });
 }};
}
