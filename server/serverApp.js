import router from "./router.js";

export default (settings) => (request, response) => {
  console.log(request);
  console.log(settings);
  console.log(router);
  response.writeHead(200);
  response.end("hi");
};
