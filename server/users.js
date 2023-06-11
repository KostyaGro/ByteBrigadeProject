// import fs from 'fs';
// import path from 'path';
import readObjFromFile from './readObjFromFile.js';

class Users {
  constructor(config) {
    this.all = readObjFromFile(config.usersDBpath);
  }
}
export default Users;
