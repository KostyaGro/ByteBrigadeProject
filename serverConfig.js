import fs from 'fs';
import readFile from './server/utils/readObjFromFile.js';

const currentConfig = readFile('./config.json');
console.log(currentConfig);
fs.writeFileSync('./config.json', JSON.stringify({ ...currentConfig, port: 80 }, null, 2));
