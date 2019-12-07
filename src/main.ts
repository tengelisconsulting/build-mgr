import { env } from 'process';

import * as Koa  from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaBodyParser from 'koa-bodyparser'
import { deploy } from './lib/handlers/deploy';
import { top_level_mware } from './lib/middleware/top_level_mware';


const BUILD_MGR_PORT = parseInt(env['BUILD_MGR_PORT']);

const app = new Koa();
const router = new KoaRouter();

router
  .post('/dev/deploy', deploy)
;

app
  .use(top_level_mware)
  .use(koaBodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
;

console.log(`listening on port ${BUILD_MGR_PORT}`);
app.listen(BUILD_MGR_PORT);
