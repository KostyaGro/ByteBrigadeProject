import Products from '../products.js';
import Users from '../users.js';
import parseCookie from '../utils/parseCookie.js';

const routes = {
  GET: {
    // cart: (request, response) => {},
    'products/': ({ response, products }) => {
      response.writeHead(200);
      response.end(JSON.stringify(products.all));
    },
    'product/(\\w+)': ({ response, products, ID }) => {
      response.writeHead(200);
      response.end(JSON.stringify(products.getByID(ID)));
    },
  },
  POST: {
    // 'cart-add-product/(\\w+)': (request, response) => {},
    user: ({ response, body, users }) => {
      const credentials = JSON.parse(body);
      if (users.isAvailable(credentials)) {
        users.add(credentials);
        response.writeHead(200);
        response.end();
        console.log('user added');
        console.log(users.all);
        return;
      }
      console.log('user not added');
      response.writeHead(400); // уточнить код ошибки
      response.end();
    },
    login: ({ response, body, users }) => {
      console.log('=}} login attempt');
      const credentials = JSON.parse(body);
      if (!users.hasUser(credentials.loginName)) {
        console.log(`login as "${credentials.loginName}" failed, user is not registered`);
        response.writeHead(400);
        response.end();
      }

      if (users.checkCredentials(credentials)) {
        console.log(`login as "${credentials.loginName}" succesfull`);
        response.writeHead(200, { 'Set-Cookie': `loginedAs = ${users.findUserID(credentials.loginName)}; path = / ` });
        response.end();
      } else {
        console.log(`login as "${credentials.loginName}" failed, wrong password`);
        response.writeHead(400);
        response.end();
      }
    },
  },
  DELETE: {
    // 'cart-remove-item/(\\w+)': (request, response, body, matches) => {},
    logout: ({ request, response }) => {
      console.log(request.headers.cookie);
      const { loginedAs } = parseCookie(request.headers.cookie);

      if (!loginedAs) {
        response.writeHead(400); // код ошибки?
        response.end("Can't logout as you are not logged in");
        return;
      }
      response.writeHead(200, { 'Set-Cookie': `loginedAs = ${loginedAs}; path = /; max-age=0;` });
      response.end();
    },
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
      console.log('body: ', body);
      const { pathname } = new URL(request.url, `http://${request.headers.host}`);
      const route = routes[request.method];

      const result = pathname && Object.keys(route).find((str) => {
        const regexp = new RegExp(`^/api/${str}$`);
        console.log(regexp);
        const matches = pathname.match(regexp);
        if (!matches) {
          return false;
        }

        const ID = matches[1];
        route[str]({
          request, response, matches, body, users, products, ID,
        });
        return true;
      });

      if (!result) {
        response.writeHead(404);
        response.end();
        return false;
      }
    });
  //   const pathParts = request.url.slice(5).split('/');
  return true;
};

export default apiRouter;
