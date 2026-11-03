import * as T from './vendor/three.js';
import {excavationPayload,excavationState,screenPayloadHeight} from './loading.js';
import {buildConveyor} from './conveyor.js';
import {createBrickJourney,TRACKED_BRICK_ID,chainPhase} from './brick-journey.js';
import {shapingState,shapingTravel,tilePose,ease} from './shaping.js';
import {clayGeometry} from './clay-geometry.js';
import {createTraceMarker} from './trace-marker.js';
import {materialState,packagingProgress,thermalState,thermalProgress} from './material-flow.js';
import {industrialMaterial} from './surfaces.js';
import {buildStage} from './machines.js';
export const stations=[[-28,-7],[-14,-7],[0,-7],[14,-7],[28,-7],[28,7],[14,7],[0,7],[-14,7],[-28,7]];
export function buildFactory(branch){
 const root=new T.Group(),machines=[],labels=[],mats={};
 const material=c=>mats[c]??=industrialMaterial(c);
 function box(x,y,z,w,h,d,c){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material(c));m.position.set(x,y,z);m.receiveShadow=true;root.add(m);return m}
 box(0,-.55,0,78,.6,32,'#8e9291');box(0,-.22,0,75,.05,29,'#b8bcba');
 // Clearly separated work cells, a central service aisle and a perimeter delivery road.
 box(0,-.17,0,73,.03,3.5,'#d1dacd');box(0,-.18,13,75,.05,3,'#87968d');
 for(let x=-35;x<37;x+=3)box(x,-.14,13,1.4,.02,.08,'#edf0df');
 for(let x=-36;x<=36;x+=4){box(x,-.15,-13.7,1.5,.025,.08,'#b9c7ad');box(x,-.15,10.7,1.5,.025,.08,'#b9c7ad')}
 for(let i=0;i<10;i++){
  const m=buildStage(i,branch,{detail:false}),[x,z]=stations[i];m.root.position.set(x,0,z);
  if(i>=5)m.root.rotation.y=Math.PI;
  m.root.traverse(o=>{if(o.userData.annotation)o.visible=false;if(o.isMesh){o.castShadow=true;if((o.userData.payload||o.userData.transport)&&i>2&&i<8)o.visible=false;if(o.material?.emissiveIntensity)o.material.emissiveIntensity=Math.min(1,o.material.emissiveIntensity)}});
  root.add(m.root);machines.push(m);labels.push(new T.Vector3(x,4.2,z));
  // Safety markings and floor number tiles around each station.
  for(let k=0;k<9;k++)box(x-5+k*1.2,-.01,z-3.8,.65,.025,.13,k%2?'#41594a':'#d8b66a');
 }
 // One continuous distance-based route. Rounded turns avoid abrupt direction changes.
 const route=new T.CurvePath();const v=(x,z)=>new T.Vector3(x,1.02,z);
 route.add(new T.CubicBezierCurve3(v(-24.3,-9.4),v(-21,-9.4),v(-21,-7),v(-18.5,-7)));
 route.add(new T.LineCurve3(v(-18.5,-7),v(32,-7)));
 route.add(new T.CubicBezierCurve3(v(32,-7),v(36,-7),v(36,-5),v(36,-3)));
 route.add(new T.LineCurve3(v(36,-3),v(36,3)));
 route.add(new T.CubicBezierCurve3(v(36,3),v(36,5),v(36,7),v(32,7)));
 route.add(new T.LineCurve3(v(32,7),v(-29,7)));
 const journey=createBrickJourney(route);
 // The lower belt is always below the whole filter. The separate upper feeder ends before the mesh.
 const receivingRoute=new T.CurvePath();receivingRoute.add(new T.LineCurve3(v(-17.6,-7),v(32,-7)));route.curves.slice(2).forEach(c=>receivingRoute.add(c));
 const feedPoints=[];for(let i=0;i<=90;i++){const x=-25.3+(-17.6+25.3)*i/90;let z=-7;
  if(x< -18.5){let lo=0,hi=1;for(let k=0;k<30;k++){const mid=(lo+hi)/2;if(route.curves[0].getPoint(mid).x<x)lo=mid;else hi=mid;}z=route.curves[0].getPoint((lo+hi)/2).z;}
  feedPoints.push(new T.Vector3(x,screenPayloadHeight(x),z));}
 const pallets=[],conveyor=buildConveyor(receivingRoute),feeder=buildConveyor(new T.CatmullRomCurve3(feedPoints));feeder.root.name='feed-conveyor';root.add(conveyor.root,feeder.root);
 for(let j=0;j<14;j++){
  const batch=new T.Group(),shaped=new T.Group();batch.add(shaped);root.add(batch);
  const brickMaterial=industrialMaterial('#ad8966');const pallet=new T.Group(),straps=new T.Group();batch.add(pallet,straps);for(let n=0;n<4;n++){const slat=new T.Mesh(new T.BoxGeometry(1.8,.08,.19),material('#b99a71'));slat.position.set(0,-.04,(n-1.5)*.22);pallet.add(slat)}for(const x of [-.52,.52]){const band=new T.Mesh(new T.BoxGeometry(.045,.7,.48),material('#35443f'));band.position.set(x,.31,0);straps.add(band)}
  for(let k=0;k<9;k++){const brick=new T.Mesh(clayGeometry(),brickMaterial);brick.position.set((k%3-1)*.51,.12+Math.floor(k/3)*.22,0);brick.castShadow=true;shaped.add(brick)}
  batch.userData.batchId=`batch-${j}`;if(j===0){batch.name="tracked-batch";shaped.children[0].name=TRACKED_BRICK_ID;}
  pallets.push({batch,shaped,brickMaterial,pallet,straps,offset:j*150/14});
 }
 const tracker=createTraceMarker(),traceMarker=tracker.root;pallets[0].batch.add(traceMarker);traceMarker.visible=false;
 const tracePosition=new T.Vector3();let traceEnabled=false;
 const gantry=new T.Group();root.add(gantry);for(const x of [-17,-11]){box(x,1.7,5.7,.16,3.4,.16,'#63766f');box(x,1.7,8.3,.16,3.4,.16,'#63766f')}box(-14,3.4,7,6.3,.2,.18,'#63766f');const gripper=box(-14,2,7,1.6,.16,.65,'#63766f');
 const ring=new T.Mesh(new T.TorusGeometry(5.7,.07,6,80),new T.MeshBasicMaterial({color:'#c39a48',transparent:true,opacity:.8}));ring.rotation.x=-Math.PI/2;root.add(ring);
 // Small landscaping and light poles give the factory a readable site boundary.
 for(const x of [-37,37])for(const z of [-11,0,10]){box(x,1.6,z,.13,3.4,.13,'#718677');box(x,3.3,z,.8,.13,.4,'#f4e5b8')}
 for(let j=0;j<12;j++){const x=-34+j*6;box(x,.05,-14.6,1.5,.3,1,'#b5c5a7');const crown=new T.Mesh(new T.IcosahedronGeometry(.65,1),material(j%2?'#91aa78':'#789767'));crown.position.set(x,.75,-14.6);root.add(crown)}
 // Instance identical conveyor hardware to keep the detailed route economical to render.
 const buckets=new Map();for(const mesh of [...root.children]){if(!mesh.isMesh||!['BoxGeometry','CylinderGeometry'].includes(mesh.geometry.type))continue;const key=mesh.geometry.type+JSON.stringify(mesh.geometry.parameters)+mesh.material.uuid;const list=buckets.get(key)||[];list.push(mesh);buckets.set(key,list)}
 for(const list of buckets.values()){if(list.length<4)continue;const first=list[0],instances=new T.InstancedMesh(first.geometry,first.material,list.length);instances.castShadow=true;instances.receiveShadow=true;list.forEach((m,i)=>{m.updateMatrix();instances.setMatrixAt(i,m.matrix);root.remove(m);if(m.geometry!==first.geometry)m.geometry.dispose()});root.add(instances)}
 return {root,labels,route,journey,conveyor,feeder,batches:pallets,tracePosition,trackedBrick:pallets[0].shaped.children[0],setTrace(enabled){traceEnabled=enabled;traceMarker.visible=enabled},update(time,selected,progress=(time/15-selected)){
 conveyor.update(time);feeder.update(time);
 const phases=pallets.map(({offset})=>chainPhase(time,offset)),stationPhases=Array(10).fill(null);
 phases.forEach(phase=>{const prev=stationPhases[phase.index];if(!prev||(phase.index===9?phase.progress>prev.progress:Math.abs(phase.progress-.5)<Math.abs(prev.progress-.5)))stationPhases[phase.index]=phase;});
 machines.forEach((m,i)=>{m.update(stationPhases[i]?.progress??0);m.root.traverse(o=>{if(o.userData.factoryHide||((o.userData.payload||o.userData.transport)&&i>2&&i<=8))o.visible=false});if(i===8)m.root.visible=false});
 gripper.position.set(-14,2.5,7);let packingBatch=null,shapingBatch=null;
 pallets.forEach(({batch,shaped,brickMaterial,pallet,straps},j)=>{
  const phase=phases[j],item=journey.sample(phase.index,phase.progress),q=item.q,point=route.getPointAt(q),tangent=route.getTangentAt(q);
  const sp=phase.index<3?0:phase.index===3?phase.progress:1;
  if(phase.index===3)point.x=10+shapingTravel(sp);
  if(phase.index===0){const payload=excavationPayload(phase.progress);point.set(stations[0][0]+payload.x,payload.y,stations[0][1]+payload.z);}
  if(phase.index===1)point.y=screenPayloadHeight(point.x);
  if(phase.index===9)point.x-=item.truckOffset;
  const state=materialState(point.x,point.z);
  batch.visible=true;batch.scale.setScalar(1);
  batch.position.copy(point);batch.rotation.set(0,-Math.atan2(tangent.z,tangent.x),0);
  if(phase.index===0){const arm=excavationState(Math.min(.72,phase.progress));batch.rotation.set(0,arm.yaw*(1-ease(.82,1,phase.progress)),-.65*ease(.65,.72,phase.progress)*(1-ease(.72,.82,phase.progress)));}
  const shape=shapingState(sp);
  const appearance=phase.index>=4?thermalState(phase.index,thermalProgress(phase.index,point.x,point.z)):state;
  brickMaterial.color.set(appearance.color);if(phase.index===3)brickMaterial.color.set('#77543f').lerp(new T.Color('#8e674f'),shape.form);brickMaterial.roughness=phase.index===3?.36+.18*shape.form:appearance.roughness;brickMaterial.emissive.set(appearance.emissive??'#ff5d16');brickMaterial.emissiveIntensity=appearance.glow||0;

  const pack=point.z>0?packagingProgress(point.x):0;if(point.z>0&&point.x< -10&&point.x> -17){packingBatch={x:point.x,p:pack};}pallet.visible=point.z>0&&point.x< -10;straps.visible=pack>.92;
  shaped.children.forEach((b,k)=>{const pose=tilePose(k,sp,branch),row=Math.floor(k/3);
   const placement=ease(0,1,(pack-row*.22)/.34);
   const grain=state.id===0?1.15:state.id===1?.75:state.id===2?.48:1;
   const compact=phase.index===0?.55+.45*ease(.82,1,phase.progress):1;
   b.visible=true;b.scale.set(pose.sx*grain*compact,pose.sy*grain*compact,pose.sz*grain*compact);
   b.morphTargetInfluences[0]=pose.morph;
   b.position.set(pose.x*compact,pose.y+row*.22*placement+Math.sin(placement*Math.PI)*.16+(phase.index===0?.03*(1-ease(.82,1,phase.progress)):0),pose.z*(1-placement)*compact);
  });

 });
 // Machinery follows the chain clock; trace never changes any batch or tool.
 shapingBatch=stationPhases[3];machines[0].update(stationPhases[0]?.progress??0);machines[0].root.traverse(o=>{if(o.userData.factoryHide)o.visible=false;});
 const trackedBatch=pallets[0],trackedMesh=trackedBatch.shaped.children[0];
 tracker.update(trackedMesh);traceMarker.visible=traceEnabled;
 trackedBatch.batch.updateWorldMatrix(true,true);traceMarker.getWorldPosition(tracePosition);
 machines[3].update(shapingBatch?.progress??0);machines[3].root.traverse(o=>{if(o.userData.payload||o.userData.factoryHide)o.visible=false});if(packingBatch){gripper.position.x=packingBatch.x;gripper.position.y=1.65+Math.sin((packingBatch.p*3%1)*Math.PI)*.5;}ring.position.set(stations[selected][0],.07,stations[selected][1]);},dispose(){conveyor.dispose();feeder.dispose();machines.forEach(m=>m.dispose());root.traverse(o=>o.geometry?.dispose());const all=new Set(Object.values(mats));root.traverse(o=>{if(o.material)all.add(o.material)});all.forEach(m=>m.dispose())}};
}
