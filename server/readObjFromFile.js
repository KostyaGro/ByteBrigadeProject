import path from 'node:path';
// import YML from 'js-yaml';
import fs from 'fs';
import { resolve } from 'path';

const readFile = (filePath) => String(
  fs.readFileSync(
    resolve(process.cwd(), filePath),
  ),
);

export default (filePath) => {
  const ext = path.extname(filePath);
  switch (ext) {
    case '.json':
      return JSON.parse(readFile(filePath) || '{}');

      // case '.yml':
      // case '.yaml':
      //   return YML.load(readFile(filePath) || '{}');

    default:
      throw new Error(`"${ext}" is unsupported file type`);
  }
};
