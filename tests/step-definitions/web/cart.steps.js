const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const {
  addProductToCartByName,
  addProductWithQuantity,
  goToCart,
  buildCartWithSubtotal,
} = require('../../support/actions');
const { CartPage } = require('../../support/pages/cart-page');

const { Given, When, Then } = createBdd();

// Regex em vez de cucumber expression porque o preço entre parênteses usa vírgula decimal
// (ex: "R$ 59,90"), que o tipo nativo {float} não reconhece - e o preço nem é usado aqui,
// é só texto informativo no cenário.
Given(/^que tenho a "([^"]+)" \(R\$ [\d,]+\) no carrinho$/, async ({ page }, productName) => {
  await addProductToCartByName(page, productName);
  await goToCart(page);
});

// Regex pra aceitar as pequenas variações de texto usadas nos cenários: com ou sem "no
// carrinho", com ou sem "exatamente", e com ou sem um comentário entre parênteses no final
// (ex: "(abaixo de R$ 200,00)") - nenhuma dessas variações muda o que o passo faz.
Given(/^que tenho itens(?: no carrinho)? cujo subtotal é(?: exatamente)? "([^"]+)"(?:\s*\(.*\))?$/, async ({ page }, subtotal) => {
  await buildCartWithSubtotal(page, subtotal);
});

Given('que tenho {int} unidades de {string} no carrinho', async ({ page }, qty, productName) => {
  await addProductWithQuantity(page, productName, qty);
  await goToCart(page);
});

Given('apliquei o cupom {string} com sucesso', async ({ page }, code) => {
  const cart = new CartPage(page);
  await cart.applyCoupon(code);
  await expect(cart.discount).not.toHaveText('R$ 0,00');
});

// Idem: aceita um comentário opcional no final, tipo "aplico o cupom "BEMVINDO10" (10%)".
When(/^aplico o cupom "([^"]+)"(?:\s*\(.*\))?$/, async ({ page }, code) => {
  await new CartPage(page).applyCoupon(code);
});

When('aplico um cupom válido de 10%', async ({ page }) => {
  await new CartPage(page).applyCoupon('BEMVINDO10');
});

When('removo o cupom atual', async ({ page }) => {
  await new CartPage(page).removeCoupon();
});

When('visualizo o carrinho', async ({ page }) => {
  await goToCart(page);
});

Then('o desconto exibido deve ser {string}', async ({ page }, expected) => {
  await expect(new CartPage(page).discount).toHaveText(expected);
});

Then('a mensagem {string} deve ser exibida', async ({ page }, message) => {
  await expect(page.getByText(message, { exact: true })).toBeVisible();
});

Then('o cupom {string} deve ser aplicado com sucesso', async ({ page }, code) => {
  await expect(page.getByText(`Cupom ${code} aplicado.`)).toBeVisible();
});

Then('não deve haver campo para digitar um novo cupom', async ({ page }) => {
  await expect(new CartPage(page).couponInput).toHaveCount(0);
});

Then('deve haver apenas a opção {string}', async ({ page }, label) => {
  await expect(page.getByRole('button', { name: label })).toBeVisible();
});

Then('o frete deve ser {string}', async ({ page }, expected) => {
  await expect(new CartPage(page).shipping).toHaveText(expected);
});

Then('o frete deve continuar {string}', async ({ page }, expected) => {
  await expect(new CartPage(page).shipping).toHaveText(expected);
});

Then('o frete cobrado deve continuar {string} \\(sem desconto aplicado sobre ele\\)', async ({ page }, expected) => {
  await expect(new CartPage(page).shipping).toHaveText(expected);
});

Then('o total deve ser {string} \\(59,90 - 5,99 + 19,90\\)', async ({ page }, expected) => {
  await expect(new CartPage(page).total).toHaveText(expected);
});

Then('todos os valores exibidos devem ter exatamente 2 casas decimais', async ({ page }) => {
  const currencyWithTwoDecimals = /^(- )?R\$ \d{1,3}(\.\d{3})*,\d{2}$/;
  const cart = new CartPage(page);
  const campos = [cart.subtotal, cart.discount, cart.shipping, cart.total];
  for (const campo of campos) {
    const texto = (await campo.textContent()).trim();
    if (texto === 'Grátis') continue; // frete grátis não é um valor monetário
    expect(texto).toMatch(currencyWithTwoDecimals);
  }
});

Then('o botão de aumentar quantidade deve estar desabilitado', async ({ page }) => {
  // O nome do produto já foi usado no "Dado" deste cenário; aqui pegamos o único botão
  // de aumentar quantidade visível, já que o cenário trabalha com um produto por vez.
  await expect(new CartPage(page).increaseQuantityButton()).toBeDisabled();
});
