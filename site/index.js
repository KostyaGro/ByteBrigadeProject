import listen from './assets/common-scripts/listeners.js';

const shopButton = document.querySelector('.go-to-shop');
listen.redirect(shopButton, '/shop/index.html');

const authButton = document.querySelector('.go-to-authorization');
listen.redirect(authButton, './authorization/index.html');
