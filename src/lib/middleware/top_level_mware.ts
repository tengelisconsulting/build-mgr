import * as Koa from 'koa';

export async function top_level_mware(
  ctx: Koa.Context, next: Koa.Next
): Promise<void > {
  try {
    await next()
  } catch (e) {
    ctx.status = parseInt(e.status || 500);
  } finally {
    ctx.set(
      'Acccess-Control-Allow-Headers',
      'Origin, Content-Type, X-signature'
    );
  }
}
