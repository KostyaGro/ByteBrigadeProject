/* eslint-disable no-param-reassign */
const parseCookie = (cookieStr) => {
  if (!cookieStr) return {};
  return cookieStr
    .split(';')
    .map((pair) => pair.split('='))
    .reduce((cookieObj, [key, value]) => {
      cookieObj[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());
      return cookieObj;
    }, {});
};
export default parseCookie;
