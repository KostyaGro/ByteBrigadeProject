import { URL } from 'url';
import staticRouter from './routers/staticRouter.js';
import apiRouter from './routers/apiRoter.js';
// import router from './routers/staticRouter.js';

export default (config) => (request, response) => {
  console.log(`> request: ${request.method}  ${request.url}  ${request.query}`);
  console.log(`cookie: ${request.headers.cookie}`);
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { searchParams } = url;
  const relativePath = url.pathname;
  console.log(
    `looking for relative path: "${relativePath}"  with searchparams: "${searchParams}"`,
  );

  if (request.url.startsWith('/api/')) {
    const isApiOk = apiRouter(request, response, config);
    if (!isApiOk) {
      response.writeHead(400);
      response.end('400 Bad Reques');
    }
    return;
  }

  const isStaticOk = staticRouter(request, response, relativePath, config);
  if (!isStaticOk) {
    response.writeHead(404);
    response.end('<p style="font-size:500%"> 404: Page not found!</p>');
  }
};
