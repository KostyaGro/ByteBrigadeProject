import fs from 'fs';
import readFile from './server/readObjFromFile.js';

const currentConfig = readFile('./config.json');
console.log(currentConfig);
fs.writeFileSync('./config.json', JSON.stringify({ port: 80, ...currentConfig }, null, 2));
