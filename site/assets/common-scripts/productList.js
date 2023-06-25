/* eslint-disable no-param-reassign */
import {
  fetchObject,
} from './lib.js';
import listener from './listeners.js';

// добавление карточеи в список товаров
const addCard = (cardTemplateAddress, listContainerClass, blank) => fetch(cardTemplateAddress)
  .then((cardResponse) => cardResponse.text())
  .then((html) => {
    const parser = new DOMParser();
    const cardDoc = parser.parseFromString(html, 'text/html');
    const card = cardDoc.querySelector('.product-card');
    // const productList = document.querySelector(listContainerClass);
    // productList.append(card);
    blank.replaceWith(card);
    console.log('card added');
    return card;
  });

const buildCards = (products, options) => new Promise((resolve) => {
  const lastID = Object.keys(products).at(-1);
  Object
    .entries(products)
    .map(([ID, info]) => {
      const productList = document.querySelector(options.listContainerClass);
      const blank = (document.createElement('div'));
      blank.classList.add('product-card');
      productList.append(blank);
      return [ID, info, blank];
    })
    .forEach(([ID, info, blank]) => {
      addCard(options.cardTemplateAddress, options.listContainerClass, blank)
        .then((card) => {
          card.querySelector('.img-container img').src = info.productImgPath;
          card.querySelector('.product-brand').textContent = info.brand;
          card.querySelector('.product-name').textContent = info.name;
          card.querySelector('.product-description').textContent = info.description;
          card.querySelector('.price').textContent = `${info.price} \u20bd`;
          listener.removeFromCart(card.querySelector('.remove-from-cart'));
          listener.addToCart(card.querySelector('.add-to-cart-button'));
          listener.addToCart(card.querySelector('.plus-cart-button'));
          listener.subtractFromCart(card.querySelector('.minus-cart-button'), options.removeCardIfEmpty);

          card.id = ID;
          console.log(`ID: ${ID} | info: ${info}`);
          // return card;
          if (ID === lastID) {
            console.log('getting products');
            resolve(products);
          }
        });
    });
});

// --- заполнение списка товаров ---
const getFrom = (inputOptions) => new Promise((resolve) => {
  const DefaultOptions = {
    fetchAddress: '/api/products/',
    cardTemplateAddress: '/shop/podutct-card.html',
    removeCardIfEmpty: false,
    listContainerClass: '.product-list-container',
  };
  const options = { ...DefaultOptions, ...inputOptions };
  fetchObject(options.fetchAddress)
    .then((obj) => resolve(buildCards(obj, options)));
});

export default {
  buildCards,
  getFrom,
  addCard,
};
