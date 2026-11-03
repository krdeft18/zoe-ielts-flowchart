import * as T from './vendor/three.js';
import {buildDetailPayload} from './detail-payload.js';
import {excavationState,excavationPayload,excavationLoadPose,screenPayloadHeight} from './loading.js';
import {buildConveyor} from './conveyor.js';
import {thermalState} from './material-flow.js';
import {contactShadow} from './contact-shadows.js';
import {shapingState,shapingTravel,shapingToolPose,tilePose} from './shaping.js';
import {clayGeometry} from './clay-geometry.js';
import {buildEffect,buildAtmosphere,effectEnvelope} from './effects.js';
import {industrialMaterial} from './surfaces.js';
const clay='#94704e',wet='#ac8966',fired='#be6944',steel='#63766f',yellow='#e9b744';
export const clamp=x=>Math.max(0,Math.min(1,x));
export function phase(p,a,b){return clamp((p-a)/(b-a))}
export function buildStage(index,branch,{detail=true}={}){
const root=new T.Group(),updates=[],conveyors=[],materials={},geometryCache={};
function softenedBox(w,h,d){const key=[w,h,d].join(':');if(geometryCache[key])return geometryCache[key];const r=Math.min(.035,w*.12,h*.12,d*.12);if(r<.015)return geometryCache[key]=new T.BoxGeometry(w,h,d);const shape=new T.Shape();shape.moveTo(-w/2+r,-h/2+r);shape.lineTo(w/2-r,-h/2+r);shape.lineTo(w/2-r,h/2-r);shape.lineTo(-w/2+r,h/2-r);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:2,steps:1,curveSegments:1});geo.translate(0,0,-d/2+r);return geometryCache[key]=geo}
function material(c){return materials[c]??=industrialMaterial(c)}
function box(g,x,y,z,w,h,d,c){const m=new T.Mesh(softenedBox(w,h,d),material(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function cyl(g,x,y,z,r,h,c){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,20),material(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function group(g,x=0,y=0,z=0){const a=new T.Group();a.position.set(x,y,z);g.add(a);return a}
function beam(g,a,b,r,c){const v=new T.Vector3(...b).sub(new T.Vector3(...a));const m=cyl(g,...a,r,v.length(),c);m.position.addScaledVector(v,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m}
function tag(g,text,x,y,z){const c=document.createElement('canvas');c.width=768;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#f8faf3';ctx.fillRect(0,0,768,100);ctx.fillStyle='#30473f';ctx.font='500 36px sans-serif';ctx.textAlign='center';ctx.fillText(text,384,62);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));s.userData.annotation=true;s.position.set(x,y,z);s.scale.set(3.7,.48,1);g.add(s)}
function brick(g,x,y,z,color=fired){const b=box(g,x,y,z,.65,.27,.34,color);b.userData.payload=true;return b}
function stack(g,x,y,z,color=fired,n=4){const a=group(g,x,y,z);for(let l=0;l<n;l++)for(let r=0;r<3;r++)for(let c=0;c<3;c++)brick(a,(c-1)*.7,l*.29,(r-1)*.39,color);return a}
function pallet(g,x,y,z){for(let i=0;i<5;i++)box(g,x,y,z+(i-2)*.3,2.4,.14,.23,'#b99a71');for(const dx of [-.85,.85])box(g,x+dx,y-.13,z,.2,.15,1.5,'#957950')}
function conveyor(g,x,z,len=7){const c=buildConveyor(new T.LineCurve3(new T.Vector3(x-len/2,1.02,z),new T.Vector3(x+len/2,1.02,z)),1.5);c.root.userData.factoryHide=true;g.add(c.root);conveyors.push(c);updates.push(p=>c.update(p*15));}
function particles(g,count,c,fn){for(let j=0;j<count;j++){const m=box(g,0,0,0,.09+(j%3)*.03,.09,.09,c);m.userData.processParticle=true;updates.push(p=>fn(m,p,j))}}
function fan(g,x,y,z){const f=group(g,x,y,z);cyl(f,0,0,0,.14,.12,steel);for(let i=0;i<4;i++){const a=group(f);a.rotation.z=i*Math.PI/2;box(a,.35,0,0,.6,.13,.08,'#b3c7bd')}updates.push(p=>f.rotation.z=p*50);return f}
box(root,0,-.16,0,12,.25,8,'#b5bab6');root.add(contactShadow(10,5));
if(index===0){
box(root,-2,.05,0,3.8,.25,3.8,'#ae8b60');for(let j=0;j<25;j++){const x=-3.6+(j%5)*.65,z=-1.5+Math.floor(j/5)*.6;(()=>{const lump=new T.Mesh(new T.DodecahedronGeometry(.45,1),material(clay));lump.position.set(x,.15+(j%3)*.1,z);lump.scale.set(1,.55,1);lump.rotation.set(j*.3,j*.71,0);lump.castShadow=true;root.add(lump)})()}
const machine=group(root,1.5,0,0);for(const z of [-.7,.7]){box(machine,0,.4,z,2.5,.45,.45,'#35443f');for(let j=0;j<6;j++){const w=cyl(machine,-1+j*.4,.4,z,.22,.48,'#65736a');w.rotation.x=Math.PI/2}}
for(const z of [-.94,.94])for(let k=0;k<18;k++)box(machine,-1.2+k*.14,.4,z,.08,.34,.05,'#526a5c');const body=group(machine,0,.65,0);box(body,0,.3,0,1.6,.55,1.4,yellow);box(body,.45,.95,0,.8,.9,.9,yellow);box(body,.45,1.08,.46,.56,.55,.03,'#9fc1c1');box(body,.45,1.08,-.46,.56,.55,.03,'#9fc1c1');box(body,.45,1.44,0,1,.1,1.1,steel);
for(let j=0;j<5;j++){const bolt=cyl(body,-.6+j*.28,.42,.73,.035,.04,'#d6dfd5');bolt.rotation.x=Math.PI/2}beam(body,[.1,.7,-.4],[.1,1.6,-.4],.055,steel);const boom=group(body,-.6,.6,0);beam(boom,[0,0,0],[-1.4,1.8,0],.14,yellow);beam(boom,[-.1,.15,.16],[-.9,1.4,.16],.07,'#d6dfd5');const stick=group(boom,-1.4,1.8,0);beam(stick,[0,0,0],[-.3,-1.9,0],.12,yellow);const bucket=group(stick,-.3,-1.9,0);box(bucket,-.25,0,0,.7,.16,.8,steel);box(bucket,.05,.25,0,.15,.5,.8,steel);for(const z of [-.4,.4])box(bucket,-.25,.2,z,.7,.4,.08,steel);for(let j=0;j<4;j++)box(bucket,-.65,-.03,(j-1.5)*.2,.25,.1,.1,steel);const load=box(bucket,-.25,.25,0,.5,.3,.6,clay);load.userData.factoryHide=true;load.userData.detailLegacy=true;const anchor=group(bucket,-.25,.1,0);anchor.name='excavator-trace-anchor';
const deposit=box(root,3.7,1.35,-2.4,.5,.3,.6,clay);deposit.userData.factoryHide=true;deposit.userData.detailLegacy=true;deposit.name='excavation-delivered-clay';
conveyor(root,3.7,-2.4,3);tag(root,'Clay → metal grid',3,2.5,-2.5);
updates.push(p=>{const pose=excavationState(p);body.rotation.y=pose.yaw;boom.rotation.z=pose.boom;stick.rotation.z=pose.stick;bucket.rotation.z=pose.bucket;load.visible=p>=.18&&p<=.72;deposit.visible=p>.72;const payload=excavationLoadPose(p);deposit.position.set(payload.x,payload.y,payload.z);deposit.rotation.set(0,payload.yaw,payload.tilt);});

}
if(index===1){const motor=cyl(root,1.5,1.3,1.3,.25,.7,steel);motor.rotation.x=Math.PI/2;for(let n=0;n<7;n++)box(root,1.5,1.3,1.05+n*.07,.55,.55,.025,'#526a5c');for(const x of [.6,1.5]){box(root,x,.95,1,.6,.15,.4,steel);for(const dx of [-.2,.2])cyl(root,x+dx,1.05,1,.035,.06,'#d6dfd5')}conveyor(root,0,0,9);const grid=group(root,-2,2,0);grid.name='filter-mesh';grid.rotation.z=-.08;for(let j=0;j<12;j++)box(grid,-1.4+j*.25,0,0,.045,.08,1.9,steel);for(let j=0;j<8;j++)box(grid,0,0,-.9+j*.25,2.9,.08,.045,steel);for(const z of [-1,1])box(root,-2,1.4,z,.15,1.4,.15,steel);
for(const x of [.6,1.5]){const r=cyl(root,x,1.35,0,.48,1.65,'#7b8d7e');r.rotation.x=Math.PI/2;for(let j=0;j<10;j++){const a=j*Math.PI/5;box(r,Math.cos(a)*.48,0,Math.sin(a)*.48,.08,1.6,.08,'#c0cbbb')}updates.push(p=>r.rotation.y=p*25*(x===.6?1:-1))}
particles(root,65,clay,(m,p,j)=>{const q=(p*2+j/65)%1;const x=-4.5+q*9;m.position.set(x,screenPayloadHeight(x-14)+.1,(j%7-3)*.17);m.scale.setScalar(x< -3.45?1.3:x< -1?.65:.45);m.userData.factoryHide=true;m.userData.detailLegacy=true});updates.push(p=>grid.position.y=2+Math.sin(p*120)*.025);const feederPoints=Array.from({length:40},(_,i)=>{const x=-6.5+2.9*i/39;return new T.Vector3(x,screenPayloadHeight(x-14),0)});const screenFeed=buildConveyor(new T.CatmullRomCurve3(feederPoints));screenFeed.root.userData.factoryHide=true;root.add(screenFeed.root);conveyors.push(screenFeed);updates.push(p=>screenFeed.update(p*15));tag(root,'Metal grid: separates large clumps',-2,3.2,0);tag(root,'Rollers: crush the clay',2,2.8,0)}
if(index===2){conveyor(root,0,0,8);const mixBed=box(root,0,1.15,0,3,.25,1.4,wet);mixBed.userData.detailLegacy=true;for(const z of [-.8,.8])box(root,0,1.3,z,3,.55,.1,steel);const hopper=cyl(root,-1,3,0,.65,.8,'#c4b993');const sand=box(root,-1,3.5,0,.8,.15,.8,'#d4bc81');beam(root,[1.7,1,1],[1.7,3,1],.12,'#7b9caa');beam(root,[1.7,3,1],[.8,3,0],.12,'#7b9caa');
particles(root,40,'#dfc88a',(m,p,j)=>{const q=(p*3+j/40)%1;m.position.set(-1+(j%5-2)*.07,2.8-q*1.5,(j%7-3)*.07);m.visible=p<.6});particles(root,30,'#72b2d0',(m,p,j)=>{const q=(p*4+j/30)%1;m.position.set(.8+(j%3-1)*.06,3-q*1.65,(j%5-2)*.06);m.visible=p>.15&&p<.75});
for(let j=0;j<12;j++){const chunk=box(root,0,1.42,0,.4,.13,.25,wet);chunk.userData.detailLegacy=true;updates.push(p=>{chunk.position.x=Math.cos(j+p*18)*1.1;chunk.position.z=Math.sin(j+p*18)*.45;chunk.rotation.y=p*10+j})}tag(root,'Sand',-1.5,4.1,0);tag(root,'Water',1.7,4.1,0);tag(root,'Clay + sand + water → workable mixture',0,.4,2.3)}
if(index===3){
 conveyor(root,0,0,13);
 const carrier=group(root,-4,1.02,0);carrier.name='shaping-carrier';carrier.userData.factoryHide=true;
 const tiles=[],geometry=clayGeometry(),wetMaterial=material('#77543f');
 for(let k=0;k<9;k++){const tile=new T.Mesh(geometry,wetMaterial);tile.name=`shaping-tile-${k}`;tile.castShadow=true;tile.receiveShadow=true;carrier.add(tile);tiles.push(tile);}
 updates.push(p=>{carrier.position.x=-4+shapingTravel(p);const state=shapingState(p);wetMaterial.roughness=.36+.18*state.form;wetMaterial.color.set('#77543f').lerp(new T.Color('#8e674f'),state.form);tiles.forEach((tile,k)=>{const pose=tilePose(k,p,branch);tile.position.set(pose.x,pose.y,pose.z);tile.scale.set(pose.sx,pose.sy,pose.sz);tile.morphTargetInfluences[0]=pose.morph;});});
 for(const x of [-1.1,1.1])for(const z of [-.85,.85]){cyl(root,x,1.9,z,.055,2.2,'#d6dfd5');cyl(root,x,2.8,z,.11,.5,steel);}
 box(root,0,3,0,2.5,.2,1.9,steel);
 // Side guide rails, tension hardware and hydraulic rods leave the clay visible.
 for(const z of [-.72,.72])beam(root,[-3,1.26,z],[3,1.26,z],.025,'#d6dfd5');
 const rods=[];
 for(const z of [-.7,.7]){
  cyl(root,0,2.91,z,.12,.48,steel);
  const rod=cyl(root,0,2.6,z,.045,.7,'#d6dfd5');rods.push(rod);
 }
 updates.push(p=>{const y=shapingToolPose(p,branch).y;rods.forEach(r=>{
  const length=2.88-y;r.position.y=y+length/2;r.scale.y=length/.7;
 });});
 if(branch==='wire'){
  const cutter=group(root,0,2.1,0);cutter.name='shaping-tool';
  for(const z of [-.65,.65])box(cutter,0,0,z,1.85,.1,.1,yellow);
  for(const x of [-.9,.9])box(cutter,x,0,0,.1,.1,1.4,steel);
  for(const x of [-.242,.242]){
   const wire=beam(cutter,[x,-.1,-.65],[x,-.1,.65],.009,'#d6dfd5');wire.name='cutting-wire';
   for(const z of [-.65,.65])cyl(cutter,x,.035,z,.035,.08,steel);
  }
  for(const z of [-.152,.152]){
   const wire=beam(cutter,[-.9,-.1,z],[.9,-.1,z],.009,'#d6dfd5');wire.name='cutting-wire';
  }
  updates.push(p=>cutter.position.y=shapingToolPose(p,'wire').y);
  tag(root,'Feed slab → cut through → lift wires → separate',0,3.6,0);
 }else{
  // A moving mould sleeve works in both views. Its lower carrier is hidden
  // beneath the conveyor, while the walls retract to free the formed bricks.
  const press=group(root,0,2.5,0);press.name='shaping-tool';
  for(const z of [-.7,.7])box(press,0,0,z,1.8,.14,.12,steel);
  for(const x of [-.78,.78])box(press,x,0,0,.12,.14,1.5,steel);
  for(const x of [-.484,0,.484]){
   box(press,x,.25,0,.08,.09,1.4,steel);
   for(const z of [-.7,.7])beam(press,[x,0,z],[x,.25,z],.035,'#d6dfd5');
  }
  for(let k=0;k<9;k++){
   const x=(k%3-1)*.484,z=(Math.floor(k/3)-1)*.304;
   box(press,x,0,z,.44,.14,.27,'#b0bb9b');
   beam(press,[x,.07,z],[x,.25,z],.035,'#d6dfd5');
  }
  const tray=group(root,0,1.02,0);tray.name='shaping-mould-sleeve';
  for(const z of [-.465,-.152,.152,.465])box(tray,0,.12,z,1.5,.24,.012,'#b0bb9b');
  for(const x of [-.738,-.242,.242,.738])box(tray,x,.12,0,.012,.24,.94,'#b0bb9b');
  updates.push(p=>{
   const pose=shapingToolPose(p,'mould');press.position.y=pose.y;
   tray.position.set(-4+shapingTravel(p),1.02-.3*(1-pose.mouldLift),0);
  });
  tag(root,'Fill mould → compress → retract → release',0,3.6,0);
 }
}
if(index>=4&&index<=7){const atmosphere=buildAtmosphere(index===4?'drying':index===7?'cooling':'heat');root.add(atmosphere.root);updates.push(p=>atmosphere.update(p));conveyor(root,0,0,10);const chamber=group(root);chamber.name='open-chamber-frame';
// Transparent shell identifies the enclosure while preserving top and side visibility.
const shellMaterial=new T.MeshPhysicalMaterial({color:'#9cb1bc',transparent:true,opacity:.12,roughness:.16,metalness:.15,depthWrite:false,side:T.DoubleSide});
for(const z of [-1.05,1.05]){const wall=new T.Mesh(new T.PlaneGeometry(5.2,2),shellMaterial);wall.position.set(0,1.85,z);wall.name='transparent-chamber-wall';chamber.add(wall)}const roof=new T.Mesh(new T.PlaneGeometry(5.2,2.1),shellMaterial);roof.rotation.x=-Math.PI/2;roof.position.set(0,2.85,0);roof.name='transparent-chamber-roof';chamber.add(roof);
for(const x of [-2.5,2.5])for(const z of [-1,1]){beam(chamber,[x,.85,z],[x,2.8,z],.045,steel);box(chamber,x,.83,z,.25,.08,.25,steel)}
for(const z of [-1,1])beam(chamber,[-2.5,2.8,z],[2.5,2.8,z],.04,steel);
for(let j=0;j<8;j++){const heater=box(chamber,-2.1+j*.6,.69,0,.35,.08,1.5,index===7?'#939fa3':'#b07043');heater.name='exposed-heater';}

const cart=group(root,-4,1.05,0);cart.userData.transport=true;cart.userData.detailLegacy=true;for(let j=0;j<12;j++)brick(cart,(j%4-1.5)*.7,.15+Math.floor(j/4)*.3,0,index<6?wet:fired);updates.push(p=>cart.position.x=-4+phase(p,0,.22)*4+phase(p,.78,1)*4);
const thermal=industrialMaterial('#ad8966');cart.children.forEach(b=>b.material=thermal);
updates.push(p=>{const appearance=thermalState(index,p);thermal.color.set(appearance.color);thermal.roughness=appearance.roughness;thermal.emissive.set(appearance.emissive);thermal.emissiveIntensity=appearance.glow;});
if(index===5||index===6){const fireEffect=buildEffect('fire');root.add(fireEffect.root);updates.push(p=>fireEffect.update(p));const glow=new T.PointLight('#ff7b26',18,7);glow.position.set(0,2,0);root.add(glow);updates.push(p=>glow.intensity=effectEnvelope(p)*(index===6?22:10)*(1+Math.sin(p*47)*.055));}
if(index===4){const steam=buildEffect('steam');root.add(steam.root);updates.push(p=>steam.update(p));}
if(index===7){for(const x of [-1.5,0,1.5])fan(root,x,2.2,-.7);}
const panel=box(root,2.75,1.8,-.7,.45,.7,.3,steel);box(root,2.75,1.94,-.53,.3,.17,.025,'#b7d1b1');for(let b=0;b<3;b++)box(root,2.62+b*.12,1.67,-.53,.07,.07,.03,b===0?'#d8b15b':'#a9bd9a');for(const z of [-.62,.62])beam(root,[-4,.99,z],[4,.99,z],.035,'#d5ded0');const facts=['24–48 hours','200–980°C','870–1300°C','48–72 hours'];tag(root,facts[index-4],0,3.7,0);tag(root,'Transparent enclosure · interior visible',0,.3,2.5)}
if(index===8&&!detail){const gantry=group(root);gantry.userData.factoryHide=true;for(const x of [-2,2])box(gantry,x,1.6,-1,.12,3.2,.12,steel);box(gantry,0,3.2,-1,4.2,.15,.15,steel);const head=box(gantry,0,2.5,0,.8,.16,.5,steel);updates.push(p=>{head.position.x=3*(1-(p*8%1));head.position.y=1.8+Math.sin((p*8%1)*Math.PI)*.5});pallet(root,0,.25,0);const bricks=[];for(let l=0;l<5;l++)for(let r=0;r<3;r++)for(let c=0;c<3;c++){const b=brick(root,(c-1)*.7,.48+l*.29,(r-1)*.39);const k=bricks.length;bricks.push(b);updates.push(p=>{const q=phase(p,k/80,k/80+.12);b.visible=p>=k/80;b.position.x=(c-1)*.7+(1-q)*3;b.position.y=.48+l*.29+Math.sin(q*Math.PI)*.3})}for(const x of [-.7,.7]){const strap=box(root,x,1,0,.055,1.9,1.35,'#ded4a3');updates.push(p=>strap.visible=p>.78)}tag(root,'Stack cooled bricks → secure the pallet',0,3.4,0)}
if(index===8&&detail){conveyor(root,0,0,10);tag(root,'Receive cooled bricks → stack → strap → dispatch',0,3.8,0)}
if(index===9){box(root,0,.02,0,11,.08,3,'#879084');for(let j=0;j<8;j++)box(root,-5+j*1.4,.07,0,.6,.02,.05,'#e8e2c9');const truck=group(root,0,0,0);truck.name="delivery-truck";box(truck,0,.85,0,6,.25,1.8,steel);box(truck,2,1.6,0,1.7,1.4,1.8,'#d5ddc7');box(truck,2.87,1.88,0,.03,.6,1.5,'#91b3b7');box(truck,2,1.9,.91,1.1,.6,.02,'#91b3b7');box(truck,-1,1.65,-.95,4,1.5,.1,'#aab99e');box(truck,-1,2.45,-.5,4.1,.15,1,'#cad3be');for(const x of [-2,-.8,2])for(const z of [-1,1]){const w=cyl(truck,x,.5,z,.48,.24,'#35413b');w.rotation.x=Math.PI/2;updates.push(p=>w.rotation.y=phase(p,.58,1)*20)}const forklift=group(root,-1,0,3);forklift.userData.factoryHide=true;forklift.name='delivery-forklift';box(forklift,0,.55,0,1.3,.6,1.2,yellow);for(const x of [-.65,.65])for(const z of [-.4,.4]){const w=cyl(forklift,x,.3,z,.25,.15,'#35413b');w.rotation.z=Math.PI/2}for(const x of [-.5,.5]){box(forklift,x,1.25,-.5,.1,2,.1,steel);box(forklift,x,.95,-1.1,.12,.1,1.3,steel)}box(forklift,0,1.4,.2,.65,.9,.12,steel);updates.push(p=>{forklift.position.z=3-phase(p,0,.4)*2.6+phase(p,.4,.58)*2.6;forklift.visible=p<.6});const cargo=group(truck,-1,1,0);cargo.userData.factoryHide=true;cargo.userData.detailLegacy=true;pallet(cargo,0,0,0);stack(cargo,0,.25,0,fired,4);updates.push(p=>{cargo.position.z=2.6*(1-phase(p,0,.4));truck.position.x=phase(p,.58,1)*6});tag(root,'Load packaged bricks → deliver',0,3.6,0)}
const detailPayload=detail?buildDetailPayload(index,root):null;
return {root,update(p){updates.forEach(fn=>fn(p));if(detail){root.traverse(o=>{if(o.userData.detailLegacy)o.visible=false;});detailPayload?.update(p);}},dispose(){conveyors.forEach(c=>c.dispose());root.traverse(o=>{o.geometry?.dispose();if(o.userData.annotation)o.material.map?.dispose()});const mats=new Set(Object.values(materials));root.traverse(o=>{if(o.material)mats.add(o.material)});mats.forEach(m=>m.dispose())}};
}
