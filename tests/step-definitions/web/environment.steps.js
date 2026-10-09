const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { addProductToCartByName } = require('../../support/actions');
const { CartPage } = require('../../support/pages/cart-page');

const { Given, When, Then } = createBdd();

let secondSessionCart;

Given('que adicionei produtos ao carrinho em uma aba', async ({ page }) => {
  secondSessionCart = undefined;
  await addProductToCartByName(page, 'Camiseta Essencial');
});

When('abro a loja em uma nova aba, outro navegador ou janela anônima', async ({ browser }) => {
  const freshContext = await browser.newContext();
  secondSessionCart = new CartPage(await freshContext.newPage());
  await secondSessionCart.goto();
});

Then('o carrinho da nova sessão deve iniciar vazio', async ({}) => {
  await expect(secondSessionCart.emptyCartMessage).toBeVisible();
});
