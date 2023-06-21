import { refreshLoginDependant, refreshAllCardButtons } from '../lib.js';
import listener from '../listeners.js';
import productList from '../productList.js';

const logoutButton = document.querySelector('.logout-button');
listener.logout(logoutButton);

refreshLoginDependant();
productList.getFrom({
  fetchAddress: '/api/products/',
  cardTemplateAddress: '/shop/podutct-card.html',
  listContainerClass: '.product-list-container',
})
  .then(refreshAllCardButtons);
