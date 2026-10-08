import {chmodSync,existsSync,copyFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {projectRoot} from './sites-env.mjs';
if(!existsSync(`${projectRoot}/.dev.vars`)||!existsSync(`${projectRoot}/dist/server/wrangler.json`)){console.error('Run pnpm setup first.');process.exit(1);}
// Wrangler reads private runtime bindings beside its generated config.
copyFileSync(`${projectRoot}/.dev.vars`,`${projectRoot}/dist/server/.dev.vars`);
chmodSync(`${projectRoot}/dist/server/.dev.vars`,0o600);
const child=spawn(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--port','5173','--inspector-port','0'],{cwd:projectRoot,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>{process.exitCode=code||0;});
