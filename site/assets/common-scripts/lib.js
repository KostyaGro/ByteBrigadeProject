/* eslint-disable no-param-reassign */
const hideElement = (elem) => { elem.style.display = 'none'; };
const showElement = (elem) => { elem.style.display = 'block'; };
const showFlex = (elem) => { elem.style.display = 'flex'; };

// делает запрос и отдает тело ответа виде строки из объекта/массива
const fetchStringObject = (path, options = {}) => new Promise((resolve) => {
  fetch(path, options)
    .then((resp) => (resp.json()))
    .then((resp) => resolve(JSON.stringify(resp)));
});
// делает запрос и отдает тело ответа виде объекта/массива
const fetchObject = (path, options = {}) => new Promise((resolve, reject) => {
  fetch(path, options)
    .then((resp) => {
      if (resp.status === 401) { throw new Error('you are not logged in'); }
      resolve(resp.json());
    })
    .catch((err) => reject(err));
});

const refreshTotalPrice = () => {
  const totalCostElem = document.querySelector('.total-price');
  if (!totalCostElem) return;
  fetch('/api/cart-total-price/')
    .then((resp) => resp.json())
    .then(JSON.stringify)
    .then((totalCost) => { totalCostElem.textContent = parseInt(totalCost, 10).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }); });
};

const refreshCardButtonsVisisbility = ({ container, productCount }) => {
  const showWhenEmpty = container.querySelectorAll('.show-when-empty');

  const hideWhenEmpty = container.querySelectorAll('.hide-when-empty');

  const isEmpty = () => productCount < 1;
  if (isEmpty()) {
    console.log(`empty > ID: ${container.id} | count: ${productCount}`);
    showWhenEmpty.forEach(showElement);

    hideWhenEmpty.forEach(hideElement);
    return;
  }
  console.log(`not empty > ID: ${container.id} | count: ${productCount}`);
  showWhenEmpty.forEach(hideElement);
  hideWhenEmpty.forEach(showElement);
};

const refreshAllCardButtons = () => {
  fetchObject('/api/cart-ammounts/')
    .catch(() => ({}))
    .then((cartAmmountsByID) => {
      const items = Array.from(document.querySelectorAll('.product-card'));
      // console.log(items);
      // console.log('refreshing visibility dependant on ammounts in cart');
      items.forEach((item) => {
        const productID = item.id;
        const itemAmmount = cartAmmountsByID[productID] ?? 0;
        item.querySelector('.cart-counter').textContent = itemAmmount;
        refreshCardButtonsVisisbility({ container: item, productCount: itemAmmount });
      });
    });
};

const isLoggedIn = () => document.cookie.includes('loginedAs');

// обновляет видимость объектов в зависимости от того, залогинен ли пользователь
const refreshLoginDependant = () => {
  console.log('refresh visibility is called');
  const visibleWhenLoggedIn = document.querySelectorAll('.vsible-when-logged-in');
  const visibleWhenLoggedOut = document.querySelectorAll('.vsible-when-logged-out');

  const flexVisibleWhenLoggedIn = document.querySelectorAll('.flex-container.vsible-when-logged-in');
  const flexVisibleWhenLoggedOut = document.querySelectorAll('.flex-container.vsible-when-logged-out');

  if (isLoggedIn()) {
    visibleWhenLoggedIn.forEach(showElement);
    visibleWhenLoggedOut.forEach(hideElement);

    flexVisibleWhenLoggedIn.forEach(showFlex);
    return;
  }

  visibleWhenLoggedIn.forEach(hideElement);
  visibleWhenLoggedOut.forEach(showElement);

  flexVisibleWhenLoggedOut.forEach(showFlex);
};

const clearSiblingsOfTag = (element, tag) => {
  Array.from(element
    .parentElement
    .children)
    .forEach((sibling) => sibling.classList.remove(tag));
};

const redirectGuest = (event) => {
  console.log('redirected');
  if (!isLoggedIn()) {
    console.log('redirected');
    event.preventDefault();
    document.location = '/authorization/index.html?next=account';
  }
};

export {
  clearSiblingsOfTag,
  refreshLoginDependant,
  fetchStringObject,
  fetchObject,
  refreshCardButtonsVisisbility,
  refreshAllCardButtons,
  refreshTotalPrice,
  isLoggedIn,
  redirectGuest,
};
