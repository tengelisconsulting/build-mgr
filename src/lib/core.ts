import { execSync } from "child_process";
import { env } from 'process';

import { app_state } from "./app_state";
import { BuildWork } from "./types/BuildWork";
import { pop_build_task, build_q_is_empty } from "./work_queue";


const BUILD_CMD = env['BUILD_CMD'];
const BUILD_CWD = env['BUILD_CWD'];

console.log(`using build command ${BUILD_CMD}`);
console.log(`building from directory ${BUILD_CWD}`);

export function check_for_work(): void {
  if (app_state.is_building) {  // no concurrency
    return;
  }
  if (build_q_is_empty()) {
    console.log('no more work to do');
    return;
  }
  app_state.is_building = true;
  const work: BuildWork = pop_build_task();
  console.log(`beginning build for ${work.target_git_rev}`);
  const result = execSync(
    BUILD_CMD, {
      cwd: BUILD_CWD,
    }
  ).toString();
  console.log('build output');
  console.log(result);
  app_state.is_building = false;
  check_for_work();
}
