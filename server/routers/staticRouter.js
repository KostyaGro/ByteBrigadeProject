import fs from 'fs';
import path from 'path';

const isLegitTarget = (targetPath) => fs.existsSync(targetPath) && fs.statSync(targetPath).isFile();

const formatHtml = (htmlPage) => String(htmlPage)
  .replace(/(?<=href="\S+)\.html(?=")/g, '')
  .replace(/(?<=href="\S+)index(?=")/g, '');

const staticRouter = (request, response, relativePath, config) => {
  // ------------- поиск и отдача элементов сайта из папки "./site"
  const absolutePath = path.resolve(
    config.dirname,
    config.sitePath,
    `.${relativePath}${(relativePath.at(-1) === '/') ? 'index' : ''}`,
  );

  if (isLegitTarget(absolutePath)) {
    response.writeHead(200);
    const data = fs.readFileSync(absolutePath);
    response.end(data, 'binary');
    return true;
  }

  const absolutePathHtml = `${absolutePath}.html`;
  if (isLegitTarget(absolutePathHtml)) {
    response.writeHead(200, { ContentType: 'text/html' });
    const data = fs.readFileSync(absolutePathHtml);
    response.end(formatHtml(data));
    return true;
  }

  console.log('\x1b[31m%s\x1b[0m"', 'resource isn\'t found:', `${request.url} | ${absolutePath} | ${absolutePathHtml}`);
  return false;
};

export default staticRouter;
