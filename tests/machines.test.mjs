import test from 'node:test';import assert from 'node:assert/strict';
// Canvas labels need only a drawing surface during non-rendering scene validation.
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){}})})};
const {buildStage}=await import('../dist/machines.js');
function snapshot(scene){const out=[];scene.root.traverse(o=>{out.push([o.visible,...o.position.toArray(),...o.rotation.toArray().slice(0,3),...o.scale.toArray()])});return out}
for(let i=0;i<10;i++)for(const branch of i===3?['mould','wire']:['mould'])test(`stage ${i}: ${branch} finite transforms and repeatable seeks`,()=>{const m=buildStage(i,branch);for(const p of [0,.25,.5,.75,1]){m.update(p);m.root.updateMatrixWorld(true);m.root.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)))}m.update(.3);const before=snapshot(m);m.update(.9);m.update(.3);assert.deepEqual(snapshot(m),before);assert.ok(before.length>20);m.dispose()});
for(let i=4;i<=7;i++)test(`thermal stage ${i} keeps thermal contents visible through transparent shells`,()=>{const m=buildStage(i,'mould');const frame=m.root.getObjectByName('open-chamber-frame');assert.ok(frame);const shell=frame.getObjectByName("transparent-chamber-roof");assert.ok(shell);assert.ok(shell.material.transparent && shell.material.opacity<=.15 && !shell.material.depthWrite);frame.traverse(o=>{if(o.geometry?.type==='ExtrudeGeometry'){const b=o.geometry.boundingBox; o.geometry.computeBoundingBox();const size=o.geometry.boundingBox;assert.ok(size.max.y-size.min.y<.2)}});m.dispose()});
for(const branch of ['mould','wire'])test(`close-up ${branch}: same nine tiles form without disappearing and dwell under the tool`,()=>{const m=buildStage(3,branch),carrier=m.root.getObjectByName('shaping-carrier'),tiles=Array.from({length:9},(_,i)=>m.root.getObjectByName(`shaping-tile-${i}`)),ids=tiles.map(o=>o.uuid);for(const p of [0,.2,.3,.45,.6,.7,.85,1]){m.update(p);assert.deepEqual(tiles.map(o=>o.uuid),ids);assert.ok(tiles.every(o=>o.visible&&o.scale.y>=.9));if(p>=.3&&p<=.7)assert.equal(carrier.position.x,0);}m.dispose()});
test('excavation has no free-falling debris emitter while downstream process particles remain',()=>{const dig=buildStage(0,'mould'),screen=buildStage(1,'mould');let count=0;dig.root.traverse(o=>{if(o.userData.processParticle)count++;});assert.equal(count,0);screen.root.traverse(o=>{if(o.userData.processParticle)count++;});assert.ok(count>0);dig.dispose();screen.dispose()});

test('mould sleeves remain visible in factory and retract below bricks before outfeed',()=>{
 for(const detail of [false,true]){
  const m=buildStage(3,'mould',{detail}),sleeve=m.root.getObjectByName('shaping-mould-sleeve');
  assert.ok(sleeve);assert.ok(!sleeve.parent.userData.factoryHide);
  m.update(.5);assert.equal(sleeve.position.x,0);assert.equal(sleeve.position.y,1.02);
  m.update(.77);assert.equal(sleeve.position.x,0);assert.ok(sleeve.position.y+.24<1.02);
  m.update(.9);assert.ok(sleeve.position.x>0);m.dispose();
 }
});
