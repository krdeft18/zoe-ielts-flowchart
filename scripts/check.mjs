import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
for(const dir of ['dist','scripts','tests']){
 for(const file of await readdir(new URL(`../${dir}/`,import.meta.url))){
  if(!/\.m?js$/.test(file))continue;
  const result=spawnSync(process.execPath,['--check',`${dir}/${file}`],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
 }
}
const result=spawnSync(process.execPath,['--test',...(await readdir('tests')).filter(f=>f.endsWith('.test.mjs')).map(f=>`tests/${f}`)],{stdio:'inherit'});
process.exit(result.status??1);
