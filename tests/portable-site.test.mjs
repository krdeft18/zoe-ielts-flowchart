import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {readStaticResponse,publicRoot} from '../scripts/serve.mjs';

test('local server serves entry point, JS modules, chart and JSON with correct content types',async()=>{
 for(const [path,type] of [['/','text/html'],['/app.js','text/javascript'],['/vendor/three.js','text/javascript'],['/reference.png','image/png'],['/api/v1/processes/brick-making.json','application/json']]){
  const result=await readStaticResponse(path);
  assert.equal(result.status,200,path);assert.ok(result.type.startsWith(type));assert.ok(result.body.length>0);
 }
 assert.equal((await readStaticResponse('/missing.js')).status,404);
 assert.notEqual((await readStaticResponse('/%2e%2e%2fpackage.json')).status,200);
 assert.equal((await readStaticResponse('/%ZZ')).status,400);
});

test('HTML assets, module imports and fetched data resolve inside root and project Pages URLs',async()=>{
 const html=await readFile(`${publicRoot}/index.html`,'utf8');
 const paths=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
 for(const file of await readdir(publicRoot)){
  if(!file.endsWith('.js'))continue;
  const source=await readFile(`${publicRoot}/${file}`,'utf8');
  for(const match of source.matchAll(/(?:from\s*|fetch\()['"]([^'"]+)['"]/g))paths.push(match[1]);
 }
 for(const base of ['https://example.github.io/','https://example.github.io/brick-lab/']){
  for(const path of paths){
   assert.ok(!path.startsWith('/'),`Root-absolute path breaks project Pages: ${path}`);
   const url=new URL(path,base);assert.ok(url.href.startsWith(base));
   const local='/'+url.href.slice(base.length);
   assert.equal((await readStaticResponse(local)).status,200,`${base} -> ${path}`);
  }
 }
});
