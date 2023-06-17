import { fetchObject } from './lib.js';

const userInfo = document.querySelector('.user-info');
fetchObject('/api/user/')
  .then((resp) => { userInfo.textContent = resp; });
