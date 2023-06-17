const hideElement = (elem) => elem.style.display = 'none';
const showElement = (elem) => elem.style.display = 'block';

// делает запрос и отдает тело ответа виде строки из объекта/массива
const fetchStringObject = (path, options = {}) => new Promise((resolve, reject) => {
  fetch(path, options)
    .then((resp) => (resp.json()))
    .then((resp) => resolve(JSON.stringify(resp)));
});
// делает запрос и отдает тело ответа виде объекта/массива
const fetchObject = (path, options = {}) => new Promise((resolve, reject) => {
  fetch(path, options)
    .then((resp) => resolve(resp.json()));
});

const refreshAllCardButtonsVisisbility = () => {

};

const refreshCardButtonsVisisbility = ({ container, productCount }) => {
  const showWhenEmpty = container.querySelectorAll('.show-when-empty');
  const hideWhenEmpty = container.querySelectorAll('.hide-when-empty');
  const isEmpty = () => productCount < 1;
  if (isEmpty()) {
    showWhenEmpty.forEach(showElement);
    hideWhenEmpty.forEach(hideElement);
    return;
  }
  showWhenEmpty.forEach(hideElement);
  hideWhenEmpty.forEach(showElement);
};

// обновляет видимость объектов в зависимости от того, залогинен ли пользователь
const refreshVisibility = () => {
  console.log('refresh visibility is called');
  const visibleWhenLoggedIn = document.querySelectorAll('.vsible-when-logged-in');
  const visibleWhenLoggedOut = document.querySelectorAll('.vsible-when-logged-out');
  const isLoggedIn = document.cookie.includes('loginedAs');

  if (isLoggedIn) {
    visibleWhenLoggedIn.forEach(showElement);
    visibleWhenLoggedOut.forEach(hideElement);
    return;
  }

  visibleWhenLoggedIn.forEach(hideElement);
  visibleWhenLoggedOut.forEach(showElement);
};
export {
  refreshVisibility,
  fetchStringObject,
  fetchObject,
  refreshCardButtonsVisisbility,
};
