import { clearSiblingsOfTag } from '../lib.js';

const loginTabTag = document.querySelector('.login-tab');
const registerTabTag = document.querySelector('.registration-tab');
const backButton = document.querySelector('.go-back');

backButton.addEventListener('click', () => {
  window.history.back();
});

const tabSwitcher = (btn) => {
  const callback = (e) => {
    const formName = e.target.dataset.form;
    const correspondingFormn = document.querySelector(`.${formName}`);
    clearSiblingsOfTag(correspondingFormn, 'active');
    clearSiblingsOfTag(btn, 'active');
    btn.classList.add('active');
    correspondingFormn.classList.add('active');
  };

  btn.addEventListener('click', callback);
  btn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 32) {
      callback(e);
    }
  });
};
tabSwitcher(loginTabTag);
tabSwitcher(registerTabTag);

// __________ old _______
const loginButton = document.querySelector('#login-button');
const regButton = document.querySelector('#reg-button');

loginButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const loginNameInput = document.querySelector('#loginName-log-in');
  //   const loginName = loginNameInput.value;
  const passwordInput = document.querySelector('#password-log-in');
  const credentials = { loginName: loginNameInput.value, password: passwordInput.value };

  // console.log(credentials);
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      const loginErrorOut = document.querySelector('#login-error-text');
      loginErrorOut.classList.add('hidden');
      switch (response.status) {
        case 200:
          // messageBox.textContent = 'успех';
          return true;

        case 400:
          loginErrorOut.textContent = 'неверный логин или пароль';
          loginErrorOut.classList.remove('hidden');
          break;
        default:
          return false;
      }
    })
    .then((result) => {
      if (!result) return;
      window.location = '/shop/';
    });
});

regButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const regErrorOut = document.querySelector('#registration-error-text');
  regErrorOut.classList.add('hidden');
  const regLoginName = document.querySelector('#loginName-reg').value;
  const regPassword = document.querySelector('#password-reg').value;
  const regPasswordRepeat = document.querySelector('#password-repeat-reg').value;
  if (regPassword !== regPasswordRepeat) {
    regErrorOut.textContent = 'Пароли не совпадают';
    regErrorOut.classList.remove('hidden');
    return;
  }
  const regEmail = document.querySelector('#email-reg').value;
  if (regEmail === '') {
    regErrorOut.textContent = 'Укажите ваш e-mail';
    regErrorOut.classList.remove('hidden');
    return;
  }
  const regFirstName = document.querySelector('#first-name-reg').value;
  const regSecondName = document.querySelector('#second-name-reg').value;

  const credentials = {
    loginName: regLoginName,
    password: regPassword,
    email: regEmail,
    firstName: regFirstName,
    secondName: regSecondName,
    // "phoneNumber": "+71234567890",
    // "shippingAddress": "666666",
  };
  fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(credentials),
  })
    .then((resp) => {
      if (resp.status === 403) {
        regErrorOut.textContent = 'никнейм недоступен';
        regErrorOut.classList.remove('hidden');
        return;
      }
      if (resp.status === 200) {
        regErrorOut.textContent = 'успех';
        regErrorOut.classList.remove('hidden');
        setTimeout(() => document.location = '../shop/index.html', 500);
        return;
      }
      regErrorOut.textContent = 'неизвестная ошибка';
      regErrorOut.classList.remove('hidden');
    });
});
