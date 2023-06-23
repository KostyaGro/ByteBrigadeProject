import http from 'http';
import serverApp from './server/serverApp.js';
import Config from './server/classes/config.js';

// eslint-disable-next-line no-console
console.clear();
const config = new Config('config.json');
const app = serverApp(config);

console.log(config);

http.createServer(app).listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started. Listening on ${config.port}`);
});
