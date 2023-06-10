import fs from 'fs';
import path from 'path';

class Products {
  constructor(config) {
    this.list = JSON.parse(fs.readFileSync(path.resolve(config.dirname, config.dataPath, 'products.json')));
  }
}
export default Products;
