import { BuildWork } from "./types/BuildWork";

let build_q: BuildWork[] = [];


export function build_q_is_empty(): boolean {
  return build_q.length === 0;
}

export function push_build_task(work: BuildWork): void {
  build_q = [work].concat(build_q);
}

export function pop_build_task(): BuildWork {
  return build_q.pop();
}
