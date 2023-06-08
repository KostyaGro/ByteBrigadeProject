import fs from "fs";
import path from "path";
import router from "./router.js";

export default (config) => (request, response) => {
  console.log(request.url);
  console.log(config);
  console.log(router);

  response.writeHead(200);
  const data = fs.readFileSync(
    path.resolve(config.dirname, config.sitePath, "index.html")
  );

  // response.end("hi");
  response.end(data, "binary");
};
