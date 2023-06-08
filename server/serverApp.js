import fs from "fs";
import path from "path";
import router from "./router.js";

export default (config) => (request, response) => {
  console.log(request.url);
  console.log(config);
  console.log(router);

  let data = "";
  response.writeHead(200);
  if (request.url === "/") {
    data = fs.readFileSync(
      path.resolve(config.dirname, config.sitePath, "index.html")
    );
  } else {
    try {
      const fullPath = path.resolve(
        config.dirname,
        config.sitePath,
        request.url.slice(1)
      );
      console.log(fullPath);
      data = fs.readFileSync(fullPath);
    } catch (e) {
      console.log(`can't read address: "${request.url}"`);
    }
  }

  // response.end("hi");
  response.end(data, "binary");
};
