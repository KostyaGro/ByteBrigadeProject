import path from 'path';
import readObjFromFile from './readObjFromFile.js';

export default class Config {
  constructor(configFilePath = 'config.json') {
    Object.assign(this, readObjFromFile(configFilePath));
    this.rootPath = process.cwd();
    this.usersDBpath = path.resolve(this.rootPath, this.dataDir, this.usersDBfilename);
    this.productsDBpath = path.resolve(this.rootPath, this.dataDir, this.productsDBfilename);
    this.sitePath = path.resolve(this.rootPath, this.siteDir);
    this.cartPath = path.resolve(this.rootPath, this.cartDir);
  }

  // get userDBpath() { return path.resolve(this.dirname, this.dataPath, this.userDBname); }
}
