const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { addProductToCartByName, buildCartWithSubtotal } = require('../../support/actions');
const { CartPage } = require('../../support/pages/cart-page');
const { CheckoutPage } = require('../../support/pages/checkout-page');
const { OrderConfirmedPage } = require('../../support/pages/order-confirmed-page');

const { Given, When, Then } = createBdd();

const VALID_CUSTOMER = { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' };

Given('que estou na tela de checkout com um carrinho válido', async ({ page }) => {
  await addProductToCartByName(page, 'Camiseta Essencial');
  const cart = new CartPage(page);
  await cart.goto();
  await cart.goToCheckout();
});

Given('que adiciono produtos ao carrinho até o subtotal ultrapassar R$ 200,00', async ({ page }) => {
  await buildCartWithSubtotal(page, 'R$ 209,90');
});

When('preencho o campo {string} com {string}', async ({ page }, campo, valor) => {
  const checkout = new CheckoutPage(page);
  await checkout.fillCustomerData(VALID_CUSTOMER);
  await checkout.field(campo).fill(valor);
});

When('preencho nome, email e CEP {string} \\(sem hífen\\)', async ({ page }, cep) => {
  await new CheckoutPage(page).fillCustomerData({ ...VALID_CUSTOMER, cep });
});

When('preencho os dados de entrega corretamente', async ({ page }) => {
  await new CartPage(page).goToCheckout();
  await new CheckoutPage(page).fillCustomerData(VALID_CUSTOMER);
});

When('tento confirmar o pedido', async ({ page }) => {
  await new CheckoutPage(page).confirm();
});

When('confirmo o pedido', async ({ page }) => {
  await new CheckoutPage(page).confirm();
});

Then('devo ver a mensagem de erro {string}', async ({ page }, message) => {
  await expect(page.getByText(message)).toBeVisible();
});

Then('o pedido não deve ser criado', async ({ page }) => {
  await expect(page).toHaveURL(/\/checkout$/);
});

Then('o pedido deve ser criado com sucesso', async ({ page }) => {
  await expect(page).toHaveURL(/\/pedido-confirmado$/);
});

Then('devo ver a tela {string} com um número no formato {string}', async ({ page }, _tela, _formato) => {
  await expect(page).toHaveURL(/\/pedido-confirmado$/);
  await expect(new OrderConfirmedPage(page).orderNumber).toBeVisible();
});

Then('o carrinho deve ser esvaziado', async ({ page }) => {
  const cart = new CartPage(page);
  await cart.goto();
  await expect(cart.emptyCartMessage).toBeVisible();
});
