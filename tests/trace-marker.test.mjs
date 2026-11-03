import test from 'node:test';import assert from 'node:assert/strict';import * as T from '../dist/vendor/three.js';import {clayGeometry} from '../dist/clay-geometry.js';import {createTraceMarker} from '../dist/trace-marker.js';
test('corner marker fits actual morphed vertices and follows the same parent transform',()=>{
 const parent=new T.Group(),mesh=new T.Mesh(clayGeometry(),new T.MeshBasicMaterial()),marker=createTraceMarker();parent.add(mesh,marker.root);parent.position.set(12,1,-7);parent.rotation.y=1.3;mesh.position.set(-.48,.12,-.3);
 const vertex=new T.Vector3();for(const m of [1,.75,.5,.1,0]){mesh.morphTargetInfluences[0]=m;mesh.scale.y=.9+m*.1;marker.update(mesh);parent.updateMatrixWorld(true);const box=new T.Box3().setFromCenterAndSize(marker.root.position,marker.root.scale);
 for(let i=0;i<mesh.geometry.attributes.position.count;i++){mesh.getVertexPosition(i,vertex);vertex.multiply(mesh.scale).add(mesh.position);assert.ok(box.containsPoint(vertex));}
 assert.ok(marker.root.scale.x<.56&&marker.root.scale.y<.3&&marker.root.scale.z<.4);
 const center=marker.root.getWorldPosition(new T.Vector3());assert.ok(center.distanceTo(mesh.getWorldPosition(new T.Vector3()))<.01);
 }
 assert.equal(marker.root.children[0].geometry.attributes.position.count,48);assert.ok(marker.root.children.every(o=>o.isLineSegments));
 mesh.geometry.dispose();mesh.material.dispose();marker.root.children.forEach(o=>{o.geometry.dispose();o.material.dispose()});
});
