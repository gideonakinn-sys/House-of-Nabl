let isFocusActive = false;
let isClosing = false;
let focusData = null;
let cartCount = 0;

export function getIsFocusActive() {
  return isFocusActive;
}

export function setIsFocusActive(val) {
  isFocusActive = val;
}

export function getIsClosing() {
  return isClosing;
}

export function setIsClosing(val) {
  isClosing = val;
}

export function getFocusData() {
  return focusData;
}

export function setFocusData(data) {
  focusData = data;
}

export function getCartCount() {
  return cartCount;
}

export function incrementCart() {
  cartCount++;
}

export function updateCartDisplay() {
  const el = document.querySelector('.header__cart');
  if (el) el.textContent = 'Cart (' + cartCount + ')';
}
