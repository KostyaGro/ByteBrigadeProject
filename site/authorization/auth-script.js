import { clearSiblingsOfTag, fetchObject } from '../assets/common-scripts/lib.js';

const loginTabTag = document.querySelector('.login-tab');
const registerTabTag = document.querySelector('.registration-tab');
const backButtons = document.querySelectorAll('.go-back');

const loginForm = document.querySelector('.login-form');
const regForm = document.querySelector('.registration-form');
const loginButton = document.querySelector('#login-button');
const regButton = document.querySelector('#reg-button');

backButtons.forEach((btn) => btn.addEventListener('click', () => {
  window.history.back();
}));

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

const loginCallback = (event) => {
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

        case 403:
          loginErrorOut.textContent = 'неверный пароль';
          loginErrorOut.classList.remove('hidden');
          return false;

        case 422:
          loginErrorOut.textContent = 'пользователь не зарегистрирован';
          loginErrorOut.classList.remove('hidden');
          return false;

        default:
          loginErrorOut.textContent = 'неизвестная ошибка';
          loginErrorOut.classList.remove('hidden');
          return false;
      }
    })
    .then((result) => {
      if (!result) return;
      const redirectTo = new URL(document.location).searchParams.get('next');
      if (redirectTo) {
        window.location = `/${redirectTo}/`;
        return;
      }
      window.location = '/shop/';
    });
};

// eslint-disable-next-line
String.prototype.capitalize = function () {
  if (!this) return '';
  return this[0].toLocaleUpperCase() + this.substring(1).toLocaleLowerCase();
};

// eslint-disable-next-line consistent-return
const registrationCallback = (event) => {
  event.preventDefault();
  const regErrorOut = document.querySelector('#registration-error-text');
  regErrorOut.classList.add('hidden');
  const showErrorMessage = (errString) => {
    regErrorOut.textContent = errString.capitalize();
    regErrorOut.classList.remove('hidden');
  };

  const regLoginName = document.querySelector('#loginName-reg').value;
  if (regLoginName.match(/^[0-9]+/)) return showErrorMessage('Никнейм не должен начинаться с цифр');
  if (!regLoginName.match(/^[a-zA-Z]+[a-zA-Z0-9]+$/)) return showErrorMessage('Никнейм должен состоять из латинских букв, может включать цифры');

  const regPassword = document.querySelector('#password-reg').value;
  if (!regPassword.match(/^.{4,}$/)) return showErrorMessage('Пароль слишком короткий');
  if (!regPassword.match(/^[\S]{4,}$/)) return showErrorMessage('пароль не должен содержать пробелы');

  const regPasswordRepeat = document.querySelector('#password-repeat-reg').value;
  if (!regPasswordRepeat) return showErrorMessage('Повторите пароль');
  if (regPassword !== regPasswordRepeat) return showErrorMessage('Пароли не совпадают');

  const regEmail = document.querySelector('#email-reg').value;
  if (regEmail === '') return showErrorMessage('Укажите ваш e-mail');
  if (!regEmail.match(/^[-._a-zA-z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/)) return showErrorMessage('Неверный формат e-mail');

  const regFirstName = document.querySelector('#first-name-reg').value.capitalize();
  if (!regFirstName.match(/^[а-яА-ЯёЁ]*$/)) return showErrorMessage('Имя может содержать только кириллицу');

  const regSecondName = document.querySelector('#second-name-reg').value.capitalize();
  if (!regSecondName.match(/^[а-яА-ЯёЁ]*$/)) return showErrorMessage('Фамилия может содержать только кириллицу');

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
        setTimeout(() => { document.location = '../shop/index.html'; }, 500);
        return;
      }
      regErrorOut.textContent = 'неизвестная ошибка';
      regErrorOut.classList.remove('hidden');
    });
};

regButton.addEventListener('click', registrationCallback);
regForm.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    registrationCallback(e);
  }
});

loginButton.addEventListener('click', loginCallback);
loginForm.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    loginCallback(e);
  }
});

const alreadyLoggedInMessage = document.querySelector('#already-logged-in .bold');
fetchObject('/api/user/')
  .then((resp) => {
    alreadyLoggedInMessage.textContent = `${resp.loginName}`;
    alreadyLoggedInMessage.parentElement.classList.remove('hidden');
  });

regForm.addEventListener('focusin', (e) => {
  const helpID = e.target.dataset.helpId;
  const helpPopup = document.querySelector(`#${helpID}`);
  helpPopup.classList.remove('hidden');
});

regForm.addEventListener('focusout', (e) => {
  const helpID = e.target.dataset.helpId;
  const helpPopup = document.querySelector(`#${helpID}`);
  helpPopup.classList.add('hidden');
});
