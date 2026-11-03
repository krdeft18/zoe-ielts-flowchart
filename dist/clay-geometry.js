import * as T from './vendor/three.js';
// One topology throughout: rounded clay pieces consolidate into bevelled brick tiles.
export function clayGeometry(){
 const geometry=new T.BoxGeometry(.48,.2,.3,6,3,4),base=geometry.attributes.position,clay=[];
 const half=[.24,.1,.15],r=.012;
 for(let i=0;i<base.count;i++){
  const v=new T.Vector3().fromBufferAttribute(base,i),inside=new T.Vector3(...v.toArray().map((n,a)=>Math.max(-half[a]+r,Math.min(half[a]-r,n))));
  v.sub(inside).normalize().multiplyScalar(r).add(inside);base.setXYZ(i,v.x,v.y,v.z);
  const n=new T.Vector3(v.x/.24,v.y/.1,v.z/.15).normalize();
  const grain=1+.045*Math.sin(n.x*7+n.z*4)*Math.sin(n.y*5+n.z*3);
  clay.push(n.x*.235*grain,n.y*.11*grain,n.z*.15*grain);
 }
 geometry.computeVertexNormals();const rounded=geometry.clone();rounded.setAttribute('position',new T.Float32BufferAttribute(clay,3));rounded.computeVertexNormals();geometry.morphAttributes.position=[rounded.attributes.position.clone()];geometry.morphAttributes.normal=[rounded.attributes.normal.clone()];rounded.dispose();return geometry;
}
