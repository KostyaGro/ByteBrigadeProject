import { refreshLoginDependant, refreshAllCardButtons } from '../lib.js';
import listener from '../listeners.js';
import productList from '../productList.js';

const logoutButton = document.querySelector('.logout-button');
listener.logout(logoutButton);

refreshLoginDependant();
productList.gerFrom('/api/products/', './podutct-card.html')
  .then(refreshAllCardButtons);
