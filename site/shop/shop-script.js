import {
  clearSiblingsOfTag, fetchObject, refreshLoginDependant, refreshAllCardButtons,
} from '../assets/common-scripts/lib.js';
import listener from '../assets/common-scripts/listeners.js';
import productList from '../assets/common-scripts/productList.js';

const typeListContainer = document.querySelector('.product-type-filter');
const brandListContainer = document.querySelector('.product-brand-filter');
const logoutButton = document.querySelector('.logout-button');
listener.logout(logoutButton);

const options = {
  fetchAddress: '/api/products/',
  cardTemplateAddress: '/shop/podutct-card.html',
  listContainerClass: '.product-list-container',
};

refreshLoginDependant();
productList.getFrom(options)
  .then(refreshAllCardButtons);

fetchObject('/api/user/')
  .then((resp) => {
    document.querySelector('.username').textContent = resp.loginName;
  });
// фильтрация

const applyFilters = () => {
  // type filter
  const typeFilter = typeListContainer.querySelector('.active').id;
  const filter = {};
  filter.type = typeFilter === 'all' ? [] : [typeFilter];
  // brand filter
  const checkboxes = brandListContainer.querySelectorAll('input');
  filter.brand = Array.from(checkboxes).filter((box) => box.checked).map((box) => box.id);

  fetchObject('/api/filter/', {
    method: 'OPTIONS',
    body: JSON.stringify(filter),
  })
    .then((products) => {
      document.querySelector('.product-list-container').innerHTML = '';
      return products;
    })
    .then((products) => productList.buildCards(products, options))
    .then(refreshAllCardButtons);
};

const addTypeFilter = (form) => form.addEventListener('click', (e) => {
  const buttonPressed = e.target;
  if (buttonPressed === form) return;
  if (buttonPressed.classList.contains('active')) return;

  clearSiblingsOfTag(buttonPressed, 'active');
  buttonPressed.classList.add('active');
  applyFilters();
});

const addBrandFilter = (form) => form.addEventListener('click', (e) => {
  const buttonPressed = e.target;
  if (buttonPressed === form) return;
  if (buttonPressed.tagName === 'LABEL') return;
  // console.log(buttonPressed);
  // if (buttonPressed)
  applyFilters();
});

// заполнение сприска типов
fetchObject('/api/product-variants/type')
  .then((types) => {
    types
      .forEach((type) => {
        const typeButton = document.createElement('a');
        typeButton.href = '#';
        typeButton.textContent = type;
        typeButton.id = type;
        typeListContainer.append(typeButton);
      });
  });
// заполнение списка брендов
fetchObject('/api/product-variants/brand')
  .then((brands) => {
    brands
      .forEach((brand) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = brand;
        checkbox.name = brand;
        checkbox.value = brand;
        const label = document.createElement('label');
        label.htmlFor = brand;
        label.textContent = brand;
        const newLine = document.createElement('br');
        brandListContainer.append(checkbox);
        brandListContainer.append(label);
        brandListContainer.append(newLine);
      });
  });
// добавление ивентов
addTypeFilter(typeListContainer);
addBrandFilter(brandListContainer);
