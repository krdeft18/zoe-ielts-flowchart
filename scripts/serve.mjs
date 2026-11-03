import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';

export const publicRoot=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.txt':'text/plain; charset=utf-8'};
// A local development server only. Publish dist/ directly to your static host.
export async function readStaticResponse(rawUrl,root=publicRoot){
 let path;
 try{path=decodeURIComponent(new URL(rawUrl,'http://localhost').pathname)}
 catch{return {status:400,body:'Bad request'}}
 if(path.includes('\0')||path.includes('\\'))return {status:400,body:'Bad request'};
 let file=resolve(root,'.'+path);
 if(file!==resolve(root)&&!file.startsWith(resolve(root)+sep))return {status:403,body:'Forbidden'};
 try{
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  return {status:200,body:await readFile(file),type:types[extname(file)]||'application/octet-stream'};
 }catch{return {status:404,body:'Not found'}}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||8000);
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT must be an integer from 1 to 65535');
 const server=createServer(async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return}
  const out=await readStaticResponse(req.url);
  res.writeHead(out.status,{'Content-Type':out.type||'text/plain; charset=utf-8','Cache-Control':'no-store'});
  res.end(req.method==='HEAD'?undefined:out.body);
 });
 server.on('error',error=>{console.error(error.message);process.exitCode=1});
 server.listen(port,'127.0.0.1',()=>console.log(`Brick Lab: http://localhost:${port}`));
}
