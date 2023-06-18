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

  console.log(searchParams);
  if (searchParams.toString()) {
    console.log(
      `looking for relative path: "${relativePath}"  with searchparams: "${searchParams}"`,
    );
  } else {
    console.log(
      `looking for relative path: "${relativePath}"`,
    );
  }

  if (request.url.startsWith('/api/')) {
    apiRouter(request, response, config);
    return;
  }

  staticRouter(request, response, relativePath, config);
};
