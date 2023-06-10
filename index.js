import fs from 'fs';
import path from 'path';
import http from 'http';
import serverApp from './server/serverApp.js';

// eslint-disable-next-line no-console
console.clear();

const __dirname = process.cwd();
const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'config.json')),
);
config.dirname = __dirname;
const app = serverApp(config);

console.log(config);

http.createServer(app).listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started. Listening on ${config.port}`);
});
