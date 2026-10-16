// Syncs an app directory to the default remote and prints the plan.
// Usage (from the app directory, so twenty-sdk resolves):
//   node sync-app.mjs <appPath> [--confirm-destroy]
import { appDevOnce } from 'twenty-sdk/cli';

const [appPath, flag] = process.argv.slice(2);
const result = await appDevOnce({
  appPath,
  onProgress: (message) => console.log(`[sync] ${message}`),
  onPlan: (plan) => console.log(plan.replace(/\u001b\[[0-9;]*m/g, '')),
  confirmApply: async (deleteCount) => {
    console.log(`[sync] plan destroys ${deleteCount} entities; ${flag === '--confirm-destroy' ? 'confirmed' : 'refused'}`);

    return flag === '--confirm-destroy';
  },
});

console.log(`[sync] result ${JSON.stringify(result.success ? { success: true } : result.error)}`);
process.exit(result.success ? 0 : 1);
