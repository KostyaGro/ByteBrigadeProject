import fs from 'fs';
import path from 'path';

class Users {
  constructor(config) {
    this.list = JSON.parse(fs.readFileSync(path.resolve(config.dirname, config.dataPath, 'users.json')));
  }
}
export default Users;
