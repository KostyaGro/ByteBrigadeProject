import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import router from './router.js';

const formatHtml = (htmlPage) => String(htmlPage)
  .replace(/(?<=href="\S+)\.html(?=")/g, '')
  .replace(/(?<=href="\S+)index(?=")/g, '');

const isLegitTarget = (targetPath) => fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();

export default (config) => (request, response) => {
  console.log(`> request: ${request.method}  ${request.url}`);
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { searchParams } = url;
  let relativePath = url.pathname;
  console.log(
    `looking for relative path: "${relativePath}"  with searchparams: "${searchParams}"`,
  );

  //  ============= вывести в функцию router.js ===========
  // ------------- поиск и отдача элементов сайта из папки "./site"
  if (relativePath.at(-1) === '/') relativePath += 'index';

  let data = '';
  const absolutePath = path.resolve(
    config.dirname,
    config.sitePath,
    `.${relativePath}`,
  );
  if (isLegitTarget(absolutePath)) {
    response.writeHead(200);
    data = fs.readFileSync(absolutePath);
    response.end(data, 'binary');
    return true;
  }

  const absolutePathHtml = `${absolutePath}.html`;
  if (isLegitTarget(absolutePathHtml)) {
    response.writeHead(200, { ContentType: 'text/html' });
    data = fs.readFileSync(absolutePathHtml);
    response.end(formatHtml(data));
    return true;
  }

  // ================================================
  console.log(
    `site resource isn't found on: ${request.url} | ${absolutePath} | ${absolutePathHtml}`,
  );
  return false;
};
