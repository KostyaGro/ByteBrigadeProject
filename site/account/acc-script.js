import { fetchObject } from '../assets/common-scripts/lib.js';

// const userInfo = document.querySelector('.user-info');
fetchObject('/api/user/')
  .then((resp) => {
    document.querySelector('.login-name p').textContent = resp.loginName;
    document.querySelector('.first-name p').textContent = resp.firstName;
    document.querySelector('.e-mail p').textContent = resp.email;
    // userInfo.textContent = resp;
  });
