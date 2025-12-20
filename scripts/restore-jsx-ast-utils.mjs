import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.join(__dirname, '..', 'node_modules', 'jsx-ast-utils');
const libDir = path.join(baseDir, 'lib');

if (!fs.existsSync(baseDir)) {
  console.error('jsx-ast-utils dependency missing; run npm install first.');
  process.exit(1);
}

fs.mkdirSync(libDir, { recursive: true });

const templatePath = path.join(
  __dirname,
  'templates',
  'jsx-ast-utils-lib-index.js'
);

const content = fs.readFileSync(templatePath, 'utf8');

fs.writeFileSync(path.join(libDir, 'index.js'), content);
console.log('Restored jsx-ast-utils/lib/index.js');
