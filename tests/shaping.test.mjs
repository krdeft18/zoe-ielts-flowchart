import test from 'node:test';import assert from 'node:assert/strict';import {shapingState} from '../dist/shaping.js';
test('feed, form, release are smooth bounded stages with ordered completion',()=>{const start=shapingState(0),end=shapingState(1);assert.deepEqual(start,{feed:0,form:0,release:0,tool:0});assert.deepEqual(end,{feed:1,form:1,release:1,tool:0});let last=start;for(let i=1;i<=1000;i++){const p=shapingState(i/1000);for(const key of ['feed','form','release']){assert.ok(p[key]>=last[key]);assert.ok(p[key]-last[key]<.01)}assert.ok(p.tool>=0&&p.tool<=1);last=p}assert.equal(shapingState(.3).feed,1);assert.equal(shapingState(.6).form,1);assert.equal(shapingState(.6).release,0)});
const {tilePose,shapingTravel}=await import('../dist/shaping.js');
test('shaping pauses under the tool and retains full material thickness throughout conversion',()=>{
 for(const branch of ['wire','mould'])for(let k=0;k<9;k++){let prev=tilePose(k,0,branch);for(let i=1;i<=1000;i++){const pose=tilePose(k,i/1000,branch);assert.ok(pose.sy>=.9);assert.ok(pose.morph>=0&&pose.morph<=1);for(const key of ['x','y','z','sx','sy','sz','morph'])assert.ok(Math.abs(pose[key]-prev[key])<.01);prev=pose;}}
 assert.equal(shapingTravel(0),0);assert.equal(shapingTravel(1),10);for(const p of [.3,.45,.6,.7])assert.equal(shapingTravel(p),4);
});

const {shapingToolPose,shapingAction}=await import('../dist/shaping.js');
test('mould clay stays soft until contact; wire slab is solid before cutting',()=>{
 assert.equal(tilePose(4,.28,'mould').morph,1);
 assert.equal(tilePose(4,.28,'wire').morph,0);
 assert.equal(tilePose(4,.38,'mould').morph,1);
 assert.ok(tilePose(4,.5,'mould').morph<1);
 assert.equal(tilePose(4,.6,'mould').morph,0);
 // Press at contact height before forming starts, then holds for compaction.
 assert.ok(Math.abs(shapingToolPose(.38).y-1.29)<1e-10);
 assert.equal(shapingToolPose(.38).y,shapingToolPose(.6).y);
});
test('cut reaches below the brick bottom but clears the belt; tools retract before discharge',()=>{
 const wireY=shapingToolPose(.5,'wire').y-.1;
 const brickBottom=1.02+tilePose(4,.5,'wire').y-.1;
 assert.ok(wireY+.009<brickBottom);
 assert.ok(wireY-.009>1.02);
 for(const branch of ['mould','wire'])for(let n=0;n<=1000;n++){
  const p=n/1000;
  if(shapingTravel(p)>4){
   assert.ok(shapingToolPose(p,branch).y>=2.1);
   if(branch==='mould')assert.equal(shapingToolPose(p,branch).mouldLift,0);
  }
 }
});
test('shaping action labels follow both choreographies and handle all endpoints',()=>{
 for(const branch of ['mould','wire']){
  assert.deepEqual([0,.32,.52,.7,1].map(p=>shapingAction(p,branch).index),[0,1,2,3,4]);
  assert.equal(shapingAction(1,branch).total,5);
 }
});
