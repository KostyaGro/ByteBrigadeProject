const loginButton = document.querySelector('#login-button');

loginButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const loginNameInput = document.querySelector('#loginName-log-in');
  //   const loginName = loginNameInput.value;
  const passwordInput = document.querySelector('#password-log-in');
  const credentials = { loginName: loginNameInput.value, password: passwordInput.value };

  console.log(credentials);
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      const container = loginButton.closest('div');
      const messageBox = document.createElement('p');
      container.append(messageBox);
      switch (response.status) {
        case 200:
          messageBox.textContent = 'успех';
          history.back();
          break;
        case 400:
          messageBox.textContent = 'неверный логин или пароль';
          break;
        default:
          break;
      }
    });
});

const regButton = document.querySelector('#reg-button');
