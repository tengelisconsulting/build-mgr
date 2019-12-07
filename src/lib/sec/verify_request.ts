import * as crypto from 'crypto';
import { env } from 'process';

import * as Koa from 'koa';


const ACCESS_KEY = env['ACCESS_KEY'];

export function verify_request(
  ctx: Koa.ParameterizedContext<any>
): boolean {
  if (!ctx.request.body) {
    return false;
  }
  const body_str: string = JSON.stringify(
    ctx.request.body
  );
  const computed_sig = crypto.createHmac('sha256', ACCESS_KEY)
    .update(body_str)
    .digest('hex')
  ;
  const provided_sig = ctx.request.get('X-signature');
  return provided_sig === computed_sig;
}
