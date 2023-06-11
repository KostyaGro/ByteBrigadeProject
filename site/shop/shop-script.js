const addCard = async () => fetch('./podutct-card.html')
  .then((cardResponse) => cardResponse.text())
  .then((html) => {
    const parser = new DOMParser();
    const cardDoc = parser.parseFromString(html, 'text/html');
    const card = cardDoc.querySelector('.product-list-item');
    const productList = document.querySelector('.product-list-container');
    productList.append(card);
    return card;
  });

const getProducts = async () => {
  const products = await fetch('/api/products/')
    .then(async (response) => {
      const obj = await response.json();
      return obj;
      // const txt = JSON.stringify(obj);
      // console.log(txt);
      // return txt;
    });
  Object.entries(products).forEach(async ([ID, info]) => {
    const card = await addCard();
    card.querySelector('.img-container img').src = info.productImgPath;
    card.querySelector('.product-brand').textContent = info.brand;
    card.querySelector('.product-name').textContent = info.name;
    card.querySelector('.product-description').textContent = info.description;
    card.querySelector('.price').textContent = `${info.price}$`;
    card.id = ID;
    console.log(`ID: ${ID} | info: ${info}`);
  });
  // document.querySelector('.product-list-item').textContent = products;
  return products;
};

getProducts();
// addCard().then(console.log);
