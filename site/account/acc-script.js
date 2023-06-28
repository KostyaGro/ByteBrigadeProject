import { fetchObject } from '../assets/common-scripts/lib.js';

// console.log(document.history.search({ text: '' }));

// const userInfo = document.querySelector('.user-info');
fetchObject('/api/user/')
  .then((resp) => {
    document.querySelector('.login-name p').textContent = resp.loginName;
    document.querySelector('.first-name p').textContent = resp.firstName;
    document.querySelector('.second-name p').textContent = resp.secondName;
    document.querySelector('.e-mail p').textContent = resp.email;
    document.querySelector('.reg-date p').textContent = resp.regDate ?? 'неисчислимо давно';
    // userInfo.textContent = resp;
  });
