import { request } from 'express';
import Products from '../classes/products.js';
import Users from '../classes/users.js';
import parseCookie from '../utils/parseCookie.js';
import Cart from '../classes/cart.js';

const notLoggedInError = (resp) => {
  resp.writeHead(401);
  resp.end('you are not logged in');
};

const badRequest = (resp) => {
  resp.writeHead(400);
  resp.end('bad request');
};

const sendData = (data, resp) => {
  resp.writeHead(200);
  resp.end(JSON.stringify(data));
};

const loginAs = ({ credentials, users, response }) => {
  if (!users.hasUser(credentials.loginName)) {
    console.log(`login as "${credentials.loginName}" failed, user is not registered`);
    response.writeHead(422);
    response.end();
  }

  if (users.checkCredentials(credentials)) {
    console.log(`login as "${credentials.loginName}" succesfull`);
    response.writeHead(200, { 'Set-Cookie': `loginedAs = ${users.findUserID(credentials.loginName)}; path = / ` });
    response.end();
  } else {
    console.log(`login as "${credentials.loginName}" failed, wrong password`);
    response.writeHead(403);
    response.end();
  }
};

const routes = {
  OPTIONS: {
    'filter/': ({ response, products, body }) => {
      if (body.length === 0) {
        badRequest(response);
        return;
      }
      const filter = JSON.parse(body);
      const filteredData = products.filterBy(filter);
      if (Object.keys(filteredData) === 0) {
        response.writeHead('204');
        return;
      }
      // response.writeHead('200');
      sendData(filteredData, response);
      // response.end();
    },
  },

  GET: {
    'user/': ({ userID, response, users }) => {
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      sendData(users.getUserByID(userID), response);
    },
    // _________________________________________________________
    'products/': ({ response, products }) => {
      response.writeHead(200);
      response.end(JSON.stringify(products.all));
    },
    // _________________________________________________________
    'product-variants/(\\w+)': ({ response, products, ID: property }) => {
      response.writeHead(200);
      response.end(JSON.stringify(products.getListBy(property)));
    },
    // _________________________________________________________
    'product/(\\w+)': ({ response, products, ID }) => {
      response.writeHead(200);
      response.end(JSON.stringify(products.getByID(ID)));
    },
    // _________________________________________________________
    'cart-content/': ({
      response, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      sendData(cart.content, response);
    },
    // _________________________________________________________
    'cart-ammounts/': ({
      response, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      sendData(cart.ammountByID, response);
    },
    // _________________________________________________________
    'cart-total-price/': ({
      response, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      sendData(cart.totalPrice, response);
    },
    // _________________________________________________________
  },
  // ____________________________________________________________
  // ____________________________________________________________
  POST: {
    'add-to-cart/(\\w+)': ({
      response, ID, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      cart.add(ID);
      response.writeHead(200);
      response.end(JSON.stringify(cart.ammountByID));
    },
    // _________________________________________________________
    user: ({ response, body, users }) => {
      const credentials = JSON.parse(body);
      if (users.isAvailable(credentials)) {
        users.add(credentials);
        loginAs({ credentials, users, response });
        return;
      }
      console.log('username is not available');
      response.writeHead(403);
      response.end();
    },
    // _________________________________________________________
    login: ({ response, body, users }) => {
      console.log('=}} login attempt');
      const credentials = JSON.parse(body);
      loginAs({ credentials, users, response });
    },
  },
  DELETE: {
    'subtract-from-cart/(\\w+)': ({
      response, ID, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      cart.subtract(ID);
      sendData(cart.ammountByID, response);
    },
    // _________________________________________________________
    'remove-from-cart/(\\w+)': ({
      response, ID, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      cart.remove(ID);
      sendData(cart.ammountByID, response);
    },
    // _________________________________________________________
    'clear-cart/': ({
      response, userID, products,
    }) => {
      console.log(`UID ===>${userID}`);
      if (!userID) {
        notLoggedInError(response);
        return;
      }
      const cart = new Cart(userID, products);
      cart.clearAll();
      sendData(cart.content, response);
    },
    // _________________________________________________________
    logout: ({ request, response }) => {
      console.log(request.headers.cookie);
      const { loginedAs } = parseCookie(request.headers.cookie);

      if (!loginedAs) {
        response.writeHead(401);
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
        // console.log(regexp);
        const matches = pathname.match(regexp);
        if (!matches) {
          return false;
        }

        const { loginedAs: userID } = parseCookie(request.headers.cookie); // сделать абстракцию

        const ID = matches[1];
        route[str]({
          request, response, matches, body, users, products, ID, userID,
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
