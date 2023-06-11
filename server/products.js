// import fs from 'fs';
// import path from 'path';
import readObjFromFile from './readObjFromFile.js';

class Products {
  constructor(config) {
    this.all = readObjFromFile(config.productsDBpath);
  }

  getByID = (id) => this.all[id];
}

export default Products;
