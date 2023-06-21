// import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import readObjFromFile from './readObjFromFile.js';

class Products {
  constructor(config) {
    this.all = readObjFromFile(config.productsDBpath);
    // this.all = {
    console.log('=============>');
    this.all = _.merge(
      this.all,
      _.mapValues(
        this.all,
        ({ image }) => ({ productImgPath: path.resolve(config.productImgDir, image) }),
      ),
    );
  }

  getByID = (id) => this.all[id];

  getListBy = (key) => {
    const list = Object.values(_.mapValues(this.all, key));
    return _.uniq(list);
  };

  filterBy = (filtersObj) => {
    const filterKeys = Object.keys(filtersObj)
      .filter((key) => filtersObj[key].length > 0);
    const filtredIds = Object.keys(this.all)
      .filter((id) => {
        const currentProd = this.getByID(id);
        return filterKeys.reduce((acc, filterKey) => (acc && filtersObj[filterKey]
          .includes(currentProd[filterKey])), true);
      });
    return filtredIds
      .reduce((acc, currentId) => {
        acc[currentId] = this.getByID(currentId);
        return acc;
      }, {});
  };
}

export default Products;
