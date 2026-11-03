import * as T from './vendor/three.js';
import {industrialMaterial,configureTexture} from './surfaces.js';
export function buildConveyor(route,width=1.22){
 const root=new T.Group();root.name='continuous-conveyor';
 const length=route.getLength(),segments=Math.ceil(length/.16),positions=[],uv=[],indices=[],left=[],right=[];
 for(let i=0;i<=segments;i++){
  const p=route.getPointAt(i/segments),t=route.getTangentAt(i/segments),side=new T.Vector3(-t.z,0,t.x).normalize();
  for(const height of [-.025,-.17])for(const sign of [-1,1]){const v=p.clone().addScaledVector(side,sign*width/2);v.y+=height;positions.push(...v.toArray());uv.push(i/segments*length/1.2,sign===-1?0:1);}
  for(const [list,sign]of [[left,-1],[right,1]]){const v=p.clone().addScaledVector(side,sign*(width/2+.045));v.y-=.01;list.push(v);}
  if(i<segments){const a=i*4,b=a+4;indices.push(a,a+1,b,a+1,b+1,b,a,a+2,b,a+2,b+2,b,a+1,b+1,a+3,a+3,b+1,b+3);}
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const data=new Uint8Array(256*128*4);for(let y=0;y<128;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4,seam=x<5||x>250;const grain=(x*37+y*73)%13;const v=seam?105:40+grain;data.set([v,v+5,v+4,255],i);}
 const tread=new T.DataTexture(data,256,128);configureTexture(tread);tread.colorSpace=T.SRGBColorSpace;tread.needsUpdate=true;
 const rubber=industrialMaterial('#35443f');rubber.map=tread;rubber.bumpMap=tread;rubber.bumpScale=.006;rubber.side=T.DoubleSide;
 const belt=new T.Mesh(geometry,rubber);belt.name='moving-belt';belt.receiveShadow=true;root.add(belt);
 const steel=industrialMaterial('#63766f');for(const points of [left,right]){const rail=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,.035,5,false),steel);rail.castShadow=true;root.add(rail);}
 const drumGeo=new T.CylinderGeometry(.085,.085,width,16),color=[];const attr=drumGeo.attributes.position;for(let i=0;i<attr.count;i++){const angle=Math.atan2(attr.getZ(i),attr.getX(i));const shade=Math.cos(angle*2)>.82?.33:.9;color.push(shade,shade,shade);}drumGeo.setAttribute('color',new T.Float32BufferAttribute(color,3));
 const drumMat=industrialMaterial('#a2b4a7');drumMat.vertexColors=true;
 const count=Math.ceil(length/.65),drums=new T.InstancedMesh(drumGeo,drumMat,count),anchors=[];drums.name='moving-rollers';drums.castShadow=true;root.add(drums);
 const dummy=new T.Object3D(),axis=new T.Vector3(0,1,0),spin=new T.Quaternion();
 for(let i=0;i<count;i++){const p=route.getPointAt((i+.5)/count),t=route.getTangentAt((i+.5)/count),side=new T.Vector3(-t.z,0,t.x).normalize();p.y-=.12;anchors.push({p,q:new T.Quaternion().setFromUnitVectors(axis,side)});if(i%4===0){const support=new T.Mesh(new T.BoxGeometry(.1,Math.max(.1,p.y),width),steel);support.position.set(p.x,p.y/2-.1,p.z);support.rotation.y=-Math.atan2(t.z,t.x);root.add(support);}}
 return {root,belt,drums,length,segments,update(time){tread.offset.x=(1-(time*1.35/1.2)%1)%1;spin.setFromAxisAngle(axis,-time*1.35/.085);anchors.forEach(({p,q},i)=>{dummy.position.copy(p);dummy.quaternion.copy(q).multiply(spin);dummy.updateMatrix();drums.setMatrixAt(i,dummy.matrix);});drums.instanceMatrix.needsUpdate=true;},dispose(){tread.dispose();root.traverse(o=>o.geometry?.dispose());new Set([rubber,steel,drumMat]).forEach(m=>m.dispose());}};
}
