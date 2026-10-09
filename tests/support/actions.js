// Fluxos que envolvem mais de uma página (ou que precisam do catálogo de produtos).
// Interações de uma página só ficam nos Page Objects em support/pages/ - esse arquivo só
// orquestra, não conhece seletor nenhum.
const { PRODUCTS, findByName, SUBTOTAL_RECIPES } = require('./catalog');
const { HomePage } = require('./pages/home-page');
const { CartPage } = require('./pages/cart-page');

async function goToCart(page) {
  await new CartPage(page).goto();
}

async function addProductToCartByName(page, productName) {
  const product = findByName(productName);
  await new HomePage(page).addProductByIndex(product.index);
}

async function addProductByIndexAndQuantity(page, index, qty) {
  const product = PRODUCTS[index];
  await new HomePage(page).addProductByIndex(index);

  if (qty > 1) {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.increaseQuantity(product.name, qty - 1);
  }
}

async function addProductWithQuantity(page, productName, qty) {
  const product = findByName(productName);
  await addProductByIndexAndQuantity(page, product.index, qty);
}

async function buildCartWithSubtotal(page, subtotalLabel) {
  const recipe = SUBTOTAL_RECIPES[subtotalLabel];
  if (!recipe) throw new Error(`No known product combination reaches a subtotal of "${subtotalLabel}"`);
  for (const { index, qty } of recipe) {
    await addProductByIndexAndQuantity(page, index, qty);
  }
  await goToCart(page);
}

module.exports = {
  goToCart,
  addProductToCartByName,
  addProductByIndexAndQuantity,
  addProductWithQuantity,
  buildCartWithSubtotal,
};
