import fs from 'fs';
import readFile from '../readObjFromFile.js';
// eslint-disable-next-line import/no-unresolved
import Config from '#config';
// import Products from '../products.js';

export default class Cart {
  constructor(userID, productsDB, config = new Config()) {
    this.filePath = `${config.cartPath}/id_${userID}.json`;
    this.productsDB = productsDB;
    if (!fs.existsSync(this.filePath)) fs.appendFileSync(this.filePath, '{}');
    this.ammountByID = readFile(this.filePath);
  }

  get content() {
    return this.contentIDarray
      .reduce((productsInCart, productID) => ({
        ...productsInCart,
        [productID]: this.productsDB.getByID(productID),
      }), {});
  }

  clearAll() {
    this.ammountByID = {};
    this.save();
  }

  add(productID) {
    this.ammountByID[productID] = (this.ammountByID[productID] ?? 0) + 1;
    this.save();
  }

  subtract(productID) {
    if (!this.ammountByID[productID]) return;
    if (this.ammountByID[productID] === 1) { this.remove(productID); return; }
    this.ammountByID[productID] -= 1;
    this.save();
  }

  remove(productID) {
    delete this.ammountByID[productID];
    this.save();
  }

  get contentIDarray() {
    return Object.keys(this.ammountByID);
  }

  get totalPrice() {
    return Object.entries(this.ammountByID)
      .reduce(
        (total, [productID, amount]) => total + this
          .productsDB
          .getByID(productID)
          .price * amount,
        0,
      );
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.ammountByID));
  }
}

// const testConfig = new Config();
// const products = new Products(testConfig);
// // console.log(products);
// const cart = new Cart(3, products);
// cart.add(4);
// cart.add(4);
// console.log(cart.totalPrice);
// console.log(cart.content);
