import fs from 'fs';
import path from 'path';

const isLegitTarget = (targetPath) => fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();

const formatHtml = (htmlPage) => String(htmlPage)
  .replace(/(?<=['"]\S+)\.html(?=['"])/g, '')
  .replace(/(?<=['"]\S+)index(?=['"])/g, '');

const staticRouter = (request, response, relativePath, config) => {
  // ------------- поиск и отдача элементов сайта из папки "./site"
  const absolutePath = path.resolve(
    config.sitePath,
    `.${relativePath}${(relativePath.at(-1) === '/') ? 'index' : ''}`,
  );

  if (isLegitTarget(absolutePath)) {
    const ext = absolutePath.split('.').at(-1);
    let MIME = 'application/octet-stream';
    let needsReformat = false;
    let format = 'binary';
    switch (ext) {
      case 'mjs':
      case 'js':
        MIME = 'application/javascript';
        format = 'utf-8';
        needsReformat = true;
        break;
      case 'css':
        MIME = 'text/css';
        format = 'utf-8';
        break;
      case 'img':
      case 'jpg':
      case 'ico':
      case 'webp':
        MIME = 'image/png';
        break;
      case 'html':
        MIME = 'text/html';
        format = 'utf-8';
        needsReformat = true;
        break;
      default:
        break;
    }
    console.log(`ext: ${ext} | MIME: ${MIME}`);
    response.writeHead(200, { 'Content-Type': MIME });
    let data = fs.readFileSync(absolutePath);
    if (needsReformat) { data = formatHtml(data); }
    console.log(data);
    response.end(data, format);
    return true;
  }

  const absolutePathHtml = `${absolutePath}.html`;
  if (isLegitTarget(absolutePathHtml)) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    const data = fs.readFileSync(absolutePathHtml);
    const formattedHTML = formatHtml(data);
    console.log(formattedHTML);
    response.end(formattedHTML);
    return true;
  }

  console.log('\x1b[31m%s\x1b[0m"', 'resource isn\'t found:', `${request.url} | ${absolutePath} | ${absolutePathHtml}`);
  response.writeHead(404);
  response.end('<p style="font-size:500%"> 404: Page not found!</p>');
  return false;
};

export default staticRouter;
