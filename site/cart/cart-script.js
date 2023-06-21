import listener from '../listeners.js';
import { refreshLoginDependant, refreshAllCardButtons } from '../lib.js';
import productList from '../productList.js';

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

// вынести
const refreshTotalPrice = () => {
  const totalCostElem = document.querySelector('.total-price');
  fetch('/api/cart-total-price/')
    .then((resp) => resp.json())
    .then(JSON.stringify)
    .then((totalCost) => { totalCostElem.textContent = `${totalCost} \u20bd`; });
};

refreshTotalPrice();
