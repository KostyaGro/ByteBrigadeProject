import {
  fetchObject,
  refreshCardButtonsVisisbility,
  refreshLoginDependant,
  refreshAllCardButtons,
  refreshTotalPrice,
} from './lib.js';

const redirect = (button, address) => button
  .addEventListener('click', () => { window.location = address; });

const selfDestructContainer = (container) => {
  const timerID = setTimeout(() => (container.remove()), 5000);
  container.querySelectorAll('.add-to-cart-button')
    .forEach((addBtn) => addBtn.addEventListener('click', () => { clearTimeout(timerID); }, { once: true }));
};

const setDeleteTimer = (btn) => {
  btn.addEventListener('click', (event) => {
    const container = event.target.closest('.product-card');
    selfDestructContainer(container);
  });
};

const stopRefresh = (btn) => {
  btn.addEventListener('click', () => {});
};
// удаление

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
      .then(refreshCardButtonsVisisbility)
      .then(refreshTotalPrice);
  });
};

const errorPopup = document.querySelector('.error-popup');
// document.querySelector('body').addEventListener('click',popError)
const popError = (e) => {
  clearTimeout(errorPopup.timerRef);
  errorPopup.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  errorPopup.offsetHeight; /* trigger reflow */
  errorPopup.style.animation = null;
  errorPopup.style.display = 'flex';
  errorPopup.style.top = `${e.pageY - errorPopup.offsetHeight}px`;
  errorPopup.style.left = `${(e.pageX - errorPopup.offsetWidth / 2)}px`;
  errorPopup.timerRef = setTimeout(() => {
    errorPopup.style.display = 'none';
  }, 5000);
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
      // .catch(() => window.alert('войдите или зарегистрируйтесь для добавления товаров'))
      .catch(() => popError(event))
      .then(refreshCardButtonsVisisbility)
      .then(refreshTotalPrice);
  });
};

const subtractFromCart = (btn, removeIfEmpty = false) => {
  btn.addEventListener('click', (event) => {
    const container = event.target.closest('.product-card');
    const productID = container.id;
    fetchObject(`/api/subtract-from-cart/${productID}`, { method: 'delete' })
      .then((cartCount) => {
        const productCount = cartCount[String(productID)] ?? 0;
        if (removeIfEmpty && productCount === 0) { selfDestructContainer(container); }
        container
          .querySelector('.cart-counter')
          .textContent = productCount;
        console.log(cartCount);
        return ({ container, productCount });
      })
      .then(refreshCardButtonsVisisbility)
      .then(refreshTotalPrice);
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
  removeFromCart,
  addToCart,
  subtractFromCart,
  logout,
  redirect,
  setDeleteTimer,
  stopRefresh,
  popError,
};
