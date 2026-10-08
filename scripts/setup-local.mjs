import {chmodSync,existsSync,readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {projectRoot} from './sites-env.mjs';
function run(args){const r=spawnSync(process.execPath,args,{cwd:projectRoot,stdio:'inherit',env:{...process.env,CI:'true'}});if(r.status!==0)throw new Error('Local setup stopped. Read the error above and rerun after correcting it.');}
try{
 if(!existsSync('.dev.vars')){if(existsSync('private-config/local-admin.env')){copyFileSync('private-config/local-admin.env','.dev.vars');}else run(['scripts/admin-credentials.mjs']);}
 chmodSync('.dev.vars',0o600);
 const content=readFileSync('.dev.vars','utf8');if(!content.includes('ADMIN_PASSWORD_HASH=pbkdf2-sha256$600000$')||!content.includes('ADMIN_SESSION_SECRET='))throw new Error('Run pnpm admin:credentials to set your private credentials.');
 if(!existsSync('dist/server/wrangler.json'))run(['scripts/run-framework.mjs','build']);
 const built=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));mkdirSync('.sites-runtime',{recursive:true});
 writeFileSync('.sites-runtime/local-db.json',JSON.stringify({name:'hoj-local-db',compatibility_date:'2026-05-15',d1_databases:built.d1_databases.map(db=>({...db,migrations_dir:'../drizzle'}))}));
 run(['node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','.sites-runtime/local-db.json','--persist-to','.wrangler/state']);
 console.log('Local setup complete. Run pnpm start and open http://127.0.0.1:5173/admin/login. No website was published.');
}catch(e){console.error(e.message);process.exitCode=1;}
