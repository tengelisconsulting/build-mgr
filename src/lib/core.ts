import { exec } from "child_process";
import { env } from 'process';

import { app_state } from "./app_state";
import { BuildWork } from "./types/BuildWork";
import { pop_build_task, build_q_is_empty } from "./work_queue";


const BUILD_CMD = env['BUILD_CMD'];
const DEPLOY_CMD = env['DEPLOY_CMD'];

console.log(`using build command:
     ${BUILD_CMD}
`);
console.log(`using deploy command:
     ${DEPLOY_CMD}
`);

async function async_exec(cmd: string, args: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, args, (err, stdout, stderr) => {
      if (err) {
        reject(stderr.toString());
      } else {
        resolve(stdout.toString());
      }
    });
  });
}

export async function check_for_work(): Promise<void> {
  if (app_state.is_building) {  // no concurrency
    return;
  }
  if (build_q_is_empty()) {
    console.log('no more work to do');
    return;
  }
  app_state.is_building = true;
  try {
    const work: BuildWork = pop_build_task();
    const run_cmd = `${BUILD_CMD} ${work.target_git_rev}`
    console.log(`beginning build for ${work.target_git_rev}.  Running ${run_cmd}`);
    const result = await async_exec(
      run_cmd, {
        cwd: '/app/build_dir',
      }
    );
    console.log('build output');
    console.log(result);
    // in the future, the following should be made into a separate 'deploy' task
    const deploy_cmd = `${DEPLOY_CMD} ${work.target_git_rev}`;
    console.log(`beginning deploy for ${work.target_git_rev}.  Running ${deploy_cmd}`);
    const deploy_output = await async_exec(
      deploy_cmd, {
        cwd: '/app/build_dir',
      }
    );
    console.log('deploy output');
    console.log(deploy_output);
  } catch (e) {
    console.error('died doing work');
    console.trace(e);
  } finally {
    app_state.is_building = false;
    check_for_work();
  }
}
