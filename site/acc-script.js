const userInfo = document.querySelector('.user-info');
const fetchObject = (path, options = {}) => new Promise((resolve, reject) => {
  fetch(path, options)
    .then((resp) => (resp.json()))
    .then((resp) => resolve(JSON.stringify(resp)));
});

fetchObject('/api/user/')
  .then((resp) => { userInfo.textContent = resp; });
