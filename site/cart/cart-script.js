import listener from '../assets/common-scripts/listeners.js';
import {
  refreshLoginDependant, refreshAllCardButtons, fetchObject, refreshTotalPrice, redirectGuest,
} from '../assets/common-scripts/lib.js';
import productList from '../assets/common-scripts/productList.js';

const logoutButton = document.querySelector('.logout-button');
listener.logout(logoutButton);

refreshLoginDependant();
productList.getFrom({
  fetchAddress: '/api/cart-content/',
  cardTemplateAddress: '/cart/podutct-card.html',
  removeCardIfEmpty: true,
  listContainerClass: '.cart-list-container',
})
  .then(refreshAllCardButtons)
  .then(() => {
    const removeBtns = document.querySelectorAll('.remove-from-cart');
    removeBtns.forEach((btn) => {
      console.log(btn.closest('.product-card'));
      listener.setDeleteTimer(btn);
    });
  });

fetchObject('/api/user/')
  .then((resp) => {
    document.querySelector('.username').textContent = resp.loginName;
  });
// вынести

refreshTotalPrice();
const redirectedButton = document.querySelector('.redirect-to-login-if-guest');

redirectedButton.addEventListener('click', (e) => {
  document.cookie = 'backTo=cart; path=/;';
  redirectGuest(e);
});

const checkoutButton = document.querySelector('.checkout');
checkoutButton.addEventListener('click', (e) => {
  fetchObject('/api/cart-ammounts/')
    // .catch(() => ({}))
    .then((cartAmmountsByID) => {
      // console.log(Array.from(cartAmmountsByID));
      const itemsCount = Object.keys(cartAmmountsByID).length;
      if (itemsCount === 0) { listener.popError(e); return; }
      document.location = '/thanks/index.html';
    });
});
