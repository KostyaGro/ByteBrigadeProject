const getProducts = async () => {
  const products = await fetch('/api/products/')
    .then(async (response) => {
      const obj = await response.json();
      const txt = JSON.stringify(obj);
      console.log(txt);
      return txt;
    });
  document.querySelector('.product-list-item').textContent = products;
  return products;
};

getProducts();
