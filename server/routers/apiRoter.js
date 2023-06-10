import Products from '../products.js';
import Users from '../users.js';

const routes = {
  GET: {
    // cart: (request, response) => {},
    products: ({ response, products }) => {
      response.writeHead(200);
      response.end(JSON.stringify(products.list));
    },
    // 'product/(\\w+)': (request, response) => {},
  },
  POST: {
    // 'cart-add-product/(\\w+)': (request, response) => {},
    // user: (request, response) => {},
    // login: (request, response) => {},
  },
  DELETE: {
    // 'cart-remove-item/(\\w+)': (request, response, body, matches) => {},
    // logout: (request, response) => {},
  },

};

const apiRouter = (request, response, config) => {
  const users = new Users(config);
  const products = new Products(config);
  const { method } = request;
  if (!Object.hasOwn(routes, method)) return false;

  const body = [];
  request
    .on('data', (chunk) => body.push(chunk.toString()))
    .on('end', () => {
      const { pathname } = new URL(request.url, `http://${request.headers.host}`);
      const route = routes[request.method];

      const result = pathname && Object.keys(route).find((str) => {
        const regexp = new RegExp(`^/api/${str}/$`);
        console.log(regexp);
        console.log(body);
        const matches = pathname.match(regexp);
        if (!matches) {
          return false;
        }

        route[str]({
          request, response, matches, body, users, products,
        });
        return true;
      });

      if (!result) {
        // response.writeHead(404);
        // response.end();
        return false;
      }
    });
  //   const pathParts = request.url.slice(5).split('/');
  return true;
};

export default apiRouter;
