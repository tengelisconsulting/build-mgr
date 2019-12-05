import { env } from 'process';

import * as Koa  from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaBodyParser from 'koa-bodyparser'
import { deploy } from './lib/handlers/deploy';


const BUILD_MGR_PORT = parseInt(env['BUILD_MGR_PORT']);

const app = new Koa();
const router = new KoaRouter();

console.log('app');


router
  .post('/deploy', deploy)
;

app
  .use(koaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
;

console.log(`listening on port ${BUILD_MGR_PORT}`);
app.listen(BUILD_MGR_PORT);
