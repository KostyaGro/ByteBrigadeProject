import {
  fetchObject,
  refreshCardButtonsVisisbility,
  refreshLoginDependant,
  refreshAllCardButtons,
} from './lib.js';

const redirect = (button, address) => button
  .addEventListener('click', () => window.location = address);

const setDeleteTimer = (btn) => {
  btn.addEventListener('click', (event) => {
    const container = event.target.closest('.product-card');
    const { id } = container;
    const timerID = setTimeout(() => {
      document.timeout[id] = container.remove();
      console.log(document.timeout[id]);
    }, 5000);
    container.querySelectorAll('.add-to-cart-button')
      .forEach((addBtn) => addBtn.addEventListener('click', () => { clearTimeout(timerID); }));
  });
};

const stopRefresh = (btn) => {
  btn.addEventListener('click', () => {});
};

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
      .catch(() => window.alert('войдите или зарегистрируйтесь для добавления товаров в корзину'))
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
  removeFromCart, addToCart, subtractFromCart, logout, redirect, setDeleteTimer, stopRefresh,
};
