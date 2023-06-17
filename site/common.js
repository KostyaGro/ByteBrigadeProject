console.log('i`m common JS script');

const refreshVisibility = () => {
  console.log('refresh visibility is called');
  const visibleWhenLoggedIn = document.querySelectorAll('.vsible-when-logged-in');
  const visibleWhenLoggedOut = document.querySelectorAll('.vsible-when-logged-out');
  const isLoggedIn = document.cookie.includes('loginedAs');

  if (isLoggedIn) {
    visibleWhenLoggedIn.forEach((elem) => { console.log(elem); elem.style.visibility = 'visible'; });
    visibleWhenLoggedOut.forEach((elem) => { elem.style.visibility = 'hidden'; });
    return;
  }

  visibleWhenLoggedIn.forEach((elem) => { elem.style.visibility = 'hidden'; });
  visibleWhenLoggedOut.forEach((elem) => { elem.style.visibility = 'visible'; });
};
export default { refreshVisibility };
