export function getToken() {
  return sessionStorage.token || ''
}

export function setToken(token) {
  sessionStorage.setItem('token', token)
}

export function getLang() {
  return sessionStorage.lang || 'cn'
}

export function setLang(lang) {
  sessionStorage.setItem('lang', lang)
}

export function getUser() {
  const userInfo = sessionStorage.user;
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return {};
  }
}

export function setUser(userInfo) {
  sessionStorage.setItem('user', JSON.stringify(userInfo));
}

export function getTree() {
  const tree = sessionStorage.tree;
  if (tree) {
    return JSON.parse(tree);
  } else {
    return false;
  }
}

export function setTree(tree) {
  sessionStorage.setItem('tree', JSON.stringify(tree));
}

export function getCarTree() {
  const tree = sessionStorage.carTree;
  if (tree) {
    return JSON.parse(tree);
  } else {
    return false;
  }
}

export function setCarTree(tree) {
  sessionStorage.setItem('carTree', JSON.stringify(tree));
}

export function clearItem(name) {
  sessionStorage.removeItem(name)
}

export function getIsMsg() {
  return localStorage.isMsg || false;
}

export function setIsMsg(isMsg) {
  localStorage.setItem('isMsg', isMsg);
}