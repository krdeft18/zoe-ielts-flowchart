import * as T from './vendor/three.js';
// Short corner brackets avoid the diagonal clutter of a triangulated wireframe box.
export function createTraceMarker(){
 const root=new T.Group();root.name='tracked-brick-marker';const positions=[];
 for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5])for(let axis=0;axis<3;axis++){const a=[x,y,z],b=[x,y,z];b[axis]*=.52;positions.push(...a,...b);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
 for(const hidden of [true,false]){const line=new T.LineSegments(geometry,new T.LineBasicMaterial({color:'#ffe098',transparent:true,opacity:hidden?.18:1,depthTest:!hidden,depthWrite:false}));line.renderOrder=hidden?100:101;root.add(line);}
 const vertex=new T.Vector3(),bounds=new T.Box3(),size=new T.Vector3(),center=new T.Vector3();
 return {root,update(mesh){bounds.makeEmpty();for(let i=0;i<mesh.geometry.attributes.position.count;i++){mesh.getVertexPosition(i,vertex);bounds.expandByPoint(vertex);}bounds.getCenter(center);bounds.getSize(size);
 root.position.copy(center).multiply(mesh.scale).add(mesh.position);root.quaternion.copy(mesh.quaternion);
 root.scale.copy(size).multiply(mesh.scale).addScalar(.055);return root;}};
}
