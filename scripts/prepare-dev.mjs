import fs from 'fs';
import path from 'path';

const nextDir = path.join(process.cwd(), '.next');
const buildIdPath = path.join(nextDir, 'BUILD_ID');

if (fs.existsSync(buildIdPath)) {
  console.log('Removing production .next cache before starting dev server...');
  fs.rmSync(nextDir, { recursive: true, force: true });
}
