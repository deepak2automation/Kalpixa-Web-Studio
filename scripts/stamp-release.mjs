import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

// Publish only a non-secret revision identifier, never the build environment.
const revision = process.env.COMMIT_REF || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f\d]{40}$/u.test(revision)) throw new Error('A valid release revision is required.');
await writeFile(new URL('../out/release.json', import.meta.url), JSON.stringify({ revision, builtAt: new Date().toISOString() }) + '\n');
console.log(`Release revision: ${revision}`);
