import { log } from 'console';
import fs from 'fs';
import path from 'path';

const isLegitTarget = (targetPath) => fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();

const formatHtml = (htmlPage) => String(htmlPage)
  .replace(/(?<=href="\S+)\.html(?=")/g, '')
  .replace(/(?<=href="\S+)index(?=")/g, '');

const staticRouter = (request, response, relativePath, config) => {
  // ------------- поиск и отдача элементов сайта из папки "./site"
  const absolutePath = path.resolve(
    config.sitePath,
    `.${relativePath}${(relativePath.at(-1) === '/') ? 'index' : ''}`,
  );

  if (isLegitTarget(absolutePath)) {
    const ext = absolutePath.split('.').at(-1);
    let MIME = 'application/octet-stream';
    switch (ext) {
      case 'mjs':
      case 'js':
        MIME = 'application/javascript';
        break;
      case 'css':
        MIME = 'text/css';
        break;
      case 'img':
      case 'jpg':
      case 'ico':
      case 'webp':
        MIME = 'image/png';
        break;
      case 'html':
        MIME = 'text/html';
        break;
      default:
        break;
    }
    console.log(`ext: ${ext} | MIME: ${MIME}`);
    response.writeHead(200, { 'Content-Type': MIME });
    const data = fs.readFileSync(absolutePath);
    response.end(data, 'binary');
    return true;
  }

  const absolutePathHtml = `${absolutePath}.html`;
  if (isLegitTarget(absolutePathHtml)) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    const data = fs.readFileSync(absolutePathHtml);
    response.end(formatHtml(data));
    return true;
  }

  console.log('\x1b[31m%s\x1b[0m"', 'resource isn\'t found:', `${request.url} | ${absolutePath} | ${absolutePathHtml}`);
  response.writeHead(404);
  response.end('<p style="font-size:500%"> 404: Page not found!</p>');
  return false;
};

export default staticRouter;
