import {
  fetchObject,
  refreshCardButtonsVisisbility,
  refreshLoginDependant,
  refreshAllCardButtons,
} from './lib.js';

const redirect = (button, address) => button
  .addEventListener('click', () => window.location = address);

const removeFromCart = (btn) => {
  btn.addEventListener('click', (event) => {
    const container = event.target.closest('.product-card');
    const productID = container.id;
    fetchObject(`/api/remove-from-cart/${productID}`, { method: 'delete' })
      .then((cartCount) => {
        const productCount = cartCount[String(productID)] ?? 0;
        container
          .querySelector('.cart-counter')
          .textContent = productCount;
        console.log(cartCount);
        return ({ container, productCount });
      })
      .then(refreshCardButtonsVisisbility);
  });
};

const addToCart = (btn) => {
  btn.addEventListener('click', (event) => {
    const container = event.target.closest('.product-card');
    const productID = container.id;
    fetchObject(`/api/add-to-cart/${productID}`, { method: 'POST' })
      .then((cartCount) => {
        const productCount = cartCount[String(productID)] ?? 0;
        container
          .querySelector('.cart-counter')
          .textContent = productCount;
        return ({ container, productCount });
      })
      .then(refreshCardButtonsVisisbility);
  });
};

const subtractFromCart = (btn) => {
  btn.addEventListener('click', (event) => {
    const container = event.target.closest('.product-card');
    const productID = container.id;
    fetchObject(`/api/subtract-from-cart/${productID}`, { method: 'delete' })
      .then((cartCount) => {
        const productCount = cartCount[String(productID)] ?? 0;
        container
          .querySelector('.cart-counter')
          .textContent = productCount;
        console.log(cartCount);
        return ({ container, productCount });
      })
      .then(refreshCardButtonsVisisbility);
  });
};

const logout = (btn) => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    fetch('/api/logout', {
      method: 'DELETE',
    })
      .then(() => {
        refreshLoginDependant();
        refreshAllCardButtons();
      });
  });
};

export default {
  removeFromCart, addToCart, subtractFromCart, logout, redirect,
};
