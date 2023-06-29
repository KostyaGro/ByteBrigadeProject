import { fetchObject } from './assets/common-scripts/lib.js';
// import listen from './assets/common-scripts/listeners.js';

// const shopButton = document.querySelector('.go-to-shop');
// listen.redirect(shopButton, '/shop/index.html');

// const authButton = document.querySelector('.go-to-authorization');
// listen.redirect(authButton, './authorization/index.html');

const greetingsHeader = document.querySelector('.greetings');
fetchObject('/api/user/')
  .then((resp) => { greetingsHeader.textContent = `${resp.loginName}, добро пожаловать`; });
