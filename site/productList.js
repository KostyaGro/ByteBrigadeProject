import {
  fetchObject,
} from './lib.js';
import listener from './listeners.js';

// добавление карточеи в список товаров
const addCard = (cardTemplateAddress = '/shop/podutct-card.html') => fetch(cardTemplateAddress)
  .then((cardResponse) => cardResponse.text())
  .then((html) => {
    const parser = new DOMParser();
    const cardDoc = parser.parseFromString(html, 'text/html');
    const card = cardDoc.querySelector('.product-card');
    const productList = document.querySelector('.product-list-container');
    productList.append(card);
    console.log('card added');
    return card;
  });

// --- заполнение списка товаров ---
const gerFrom = (fetchAddress = '/api/products/', cardTemplateAddress = '/shop/podutct-card.html') => new Promise((resolve, reject) => {
  fetchObject(fetchAddress)
    .then((products) => {
      const lastID = Object.keys(products).at(-1);
      Object
        .entries(products)
        .forEach(([ID, info]) => {
          addCard(cardTemplateAddress).then((card) => {
            card.querySelector('.img-container img').src = info.productImgPath;
            card.querySelector('.product-brand').textContent = info.brand;
            card.querySelector('.product-name').textContent = info.name;
            card.querySelector('.product-description').textContent = info.description;
            card.querySelector('.price').textContent = `${info.price} \u20bd`;
            listener.removeFromCart(card.querySelector('.remove-from-cart'));
            listener.addToCart(card.querySelector('.add-to-cart-button'));
            listener.addToCart(card.querySelector('.plus-cart-button'));
            listener.subtractFromCart(card.querySelector('.minus-cart-button'));

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
});

export default {
  gerFrom,
  addCard,
};
