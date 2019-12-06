import * as Koa from 'koa';

import { check_for_work } from '../core';
import { push_build_task } from '../work_queue';


export async function deploy(
  ctx: Koa.ParameterizedContext<any>, _next: Koa.Next
): Promise<void> {
  const body_hash: string = JSON.stringify(
    ctx.request.body
  );
  console.log('body hash');
  console.log(body_hash);
  const target_git_rev = ctx.request.body
    .target_git_rev;
  console.log('target git rev');
  console.log(target_git_rev);
  push_build_task({
    target_git_rev: target_git_rev,
  });
  check_for_work();
  ctx.response.body = {
    status: 'OK',
  };
}
