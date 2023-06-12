// import fs from 'fs';
// import path from 'path';
import fs from 'fs';
import readObjFromFile from './readObjFromFile.js';

class Users {
  constructor(config) {
    this.all = readObjFromFile(config.usersDBpath);
    this.config = config;
  }

  static get emptyUser() {
    return {
      loginName: '',
      password: '',
      email: '',
      firstName: '',
      secondName: '',
      phoneNumber: '',
      shippingAddress: '',
      cart: [],
    };
  }

  saveDB() { fs.writeFileSync(this.config.usersDBpath, JSON.stringify(this.all, null, 2)); }

  add(credentials) {
    const lastID = Number(Object.keys(this.all).at(-1) ?? 0);
    this.all[lastID + 1] = { ...Users.emptyUser, ...credentials };
    this.saveDB();
  }
}
export default Users;
