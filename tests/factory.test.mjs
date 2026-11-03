import test from 'node:test';import assert from 'node:assert/strict';
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){}})})};
const {buildFactory,stations}=await import('../dist/factory.js');
for(const branch of ['mould','wire'])test(`factory ${branch}: all stations, moving transfers, repeatable seeks`,()=>{const factory=buildFactory(branch);assert.equal(factory.labels.length,10);assert.equal(stations.length,10);const snapshot=()=>{const a=[];factory.root.traverse(o=>a.push([...o.position.toArray(),...o.rotation.toArray().slice(0,3),o.visible]));return a};factory.update(12,0);const before=snapshot();factory.update(83,5);assert.notDeepEqual(snapshot(),before);factory.update(12,0);assert.deepEqual(snapshot(),before);factory.root.updateMatrixWorld(true);factory.root.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));factory.dispose()});
test('continuous route has no abrupt positional or tangent changes at curve joins',()=>{const f=buildFactory('mould');const curves=f.route.curves;for(let i=0;i<curves.length-1;i++){assert.ok(curves[i].getPoint(1).distanceTo(curves[i+1].getPoint(0))<1e-8);assert.ok(curves[i].getTangent(1).dot(curves[i+1].getTangent(0))>.999)}f.dispose()});
for(const branch of ['mould','wire'])test(`tracked brick ${branch}: persistent identity, continuous stage handoffs, deterministic seeking and truck delivery`,()=>{
 const f=buildFactory(branch),brick=f.trackedBrick,uuid=brick.uuid;f.setTrace(true);
 const position=(stage,p)=>{f.update(stage*15+p*15,stage,p);assert.equal(f.trackedBrick.uuid,uuid);assert.ok(f.tracePosition.toArray().every(Number.isFinite));assert.equal(f.root.getObjectByName('tracked-batch').scale.x,1);return f.tracePosition.clone()};
 for(let stage=0;stage<9;stage++){const a=position(stage,1),b=position(stage+1,0);assert.ok(a.distanceTo(b)<.001,`handoff ${stage}: ${a.distanceTo(b)}`)}
 const checkpoint=position(3,.6);position(8,.8);assert.ok(position(3,.6).distanceTo(checkpoint)<1e-10);
 for(let stage=4;stage<10;stage++){position(stage,.5);assert.ok(brick.visible);assert.ok(brick.getWorldPosition(brick.position.clone()).distanceTo(f.tracePosition)<1e-9)}
 const loaded=position(9,.58),delivered=position(9,1);assert.ok(Math.abs(delivered.x-loaded.x+6)<1e-6);assert.ok(delivered.distanceTo(position(9,1))<1e-10);
 assert.ok(f.root.getObjectByName('tracked-brick-marker').visible);f.setTrace(false);assert.equal(f.root.getObjectByName('tracked-brick-marker').visible,false);f.dispose();
});
test('tracked route never wraps; progress remains monotonic and stage boundaries match',()=>{const f=buildFactory('mould');let prev=0;for(let stage=0;stage<10;stage++)for(let p=0;p<=100;p++){const s=f.journey.sample(stage,p/100);assert.ok(s.q>=prev);assert.equal(s.id,'brick-001');prev=s.q;}assert.equal(f.journey.sample(9,2).q,prev);f.dispose()});
test('tracing is observational: all ordinary batches share motion and never hide near the tracked item',()=>{
 const f=buildFactory('mould'),a=f.batches[0],b=f.batches[1];
 const snapshot=()=>f.batches.map(({batch,shaped})=>({pos:batch.position.toArray(),rotation:batch.rotation.toArray(),visible:batch.visible,scale:batch.scale.toArray(),tiles:shaped.children.map(o=>[...o.position.toArray(),...o.scale.toArray(),...o.morphTargetInfluences])}));
 for(const t of [14,30,47,52,57,59,70,100,130,145]){
  f.setTrace(false);f.update(t,Math.min(9,Math.floor(t/15)));const before=snapshot();
  f.setTrace(true);f.update(t,Math.min(9,Math.floor(t/15)));assert.deepEqual(snapshot(),before);
  assert.ok(f.batches.every(({batch})=>batch.visible&&batch.scale.x===1));
  const position=a.batch.position.clone(),tiles=a.shaped.children.map(o=>[...o.position.toArray(),...o.scale.toArray(),...o.morphTargetInfluences]);
  f.update(t-b.offset,0);assert.ok(b.batch.position.distanceTo(position)<1e-8);assert.deepEqual(b.shaped.children.map(o=>[...o.position.toArray(),...o.scale.toArray(),...o.morphTargetInfluences]),tiles);
 }
 f.dispose();
});
test('continuous entry and exit at the shaping station',()=>{const f=buildFactory('wire');for(const t of [45,60]){f.update(t-.00001,Math.floor((t-.00001)/15));const before=f.tracePosition.clone();f.update(t+.00001,Math.floor((t+.00001)/15));assert.ok(before.distanceTo(f.tracePosition)<.001);}f.dispose()});
test('departing ordinary batch stays in the truck instead of pulling away from its cargo',()=>{const f=buildFactory('mould');for(const p of [.6,.8,.95,1]){f.update(135+p*15,9);f.root.updateMatrixWorld(true);const truck=f.root.getObjectByName('delivery-truck');const truckPoint=truck.getWorldPosition(f.tracePosition.clone());assert.ok(Math.abs(f.batches[0].batch.position.x-truckPoint.x-1)<1e-6);}f.dispose()});
test('factory renders one continuous belt, with duplicate station belts suppressed',()=>{const f=buildFactory('mould');f.update(40,2);let local=0;f.root.traverse(o=>{if(o.name==='continuous-conveyor'&&o!==f.conveyor.root){local++;assert.equal(o.visible,false);}});assert.ok(local>=7);assert.equal(f.conveyor.root.visible,true);f.dispose()});
