// import fs from 'fs';
// import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import readObjFromFile from '../utils/readObjFromFile.js';

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

  getUserByID(ID) { return this.all[ID]; }

  findUserID(loginName) { return _.findKey(this.all, (obj) => obj.loginName === loginName) ?? 0; }

  hasUser(loginName) { return this.findUserID(loginName) > 0; }

  checkCredentials({ loginName, password }) {
    if (!(password && loginName)) return false;
    const ID = this.findUserID(loginName);
    return this.hasUser(loginName) && this.getUserByID(ID).password === password;
  }

  isAvailable(credentials) {
    if (this.hasUser(credentials.loginName)) return false;
    return true;
  }

  saveDB() { fs.writeFileSync(this.config.usersDBpath, JSON.stringify(this.all, null, 2)); }

  add(credentials) {
    const regDate = new Date().toLocaleString('ru');
    const lastID = Number(Object.keys(this.all).at(-1) ?? 0);
    this.all[lastID + 1] = { ...Users.emptyUser, ...credentials, regDate };
    this.saveDB();
  }
}
export default Users;
