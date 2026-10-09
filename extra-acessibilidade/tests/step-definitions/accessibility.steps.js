const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { AxeBuilder } = require('@axe-core/playwright');
const { addProductToCartByName, goToCart } = require('../../../tests/support/actions');
const { HomePage } = require('../../../tests/support/pages/home-page');
const { CartPage } = require('../../../tests/support/pages/cart-page');
const { CheckoutPage } = require('../../../tests/support/pages/checkout-page');

const { Given, When, Then } = createBdd();

let axeResults;
let outlineStyles = [];
let headings = [];

// Fica apertando Tab até o locator passado ficar focado, ou desiste depois de várias tentativas.
async function tabAteFicarFocado(page, locator, maxTentativas = 20) {
  for (let i = 0; i < maxTentativas; i++) {
    const focado = await locator.evaluate((el) => el === document.activeElement).catch(() => false);
    if (focado) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('Não consegui chegar nesse elemento navegando só com Tab');
}

Given('que estou na página inicial', async ({ page }) => {
  await new HomePage(page).goto();
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).first().waitFor();
});

Given('que estou em qualquer página da loja', async ({ page }) => {
  await new HomePage(page).goto();
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).first().waitFor();
});

Given('que tenho um produto no carrinho', async ({ page }) => {
  await addProductToCartByName(page, 'Camiseta Essencial');
  await goToCart(page);
});

Given('que tenho um produto no carrinho e estou na página de checkout', async ({ page }) => {
  await addProductToCartByName(page, 'Camiseta Essencial');
  const cart = new CartPage(page);
  await cart.goto();
  await cart.goToCheckout();
});

When('navego até o botão {string} só com Tab e ativo com Enter', async ({ page }, _nomeBotao) => {
  const botaoAdicionar = new HomePage(page).addToCartButton(0);
  await tabAteFicarFocado(page, botaoAdicionar);
  await page.keyboard.press('Enter');
});

When('vou pro carrinho e navego até {string} só com Tab e ativo com Enter', async ({ page }, _nomeLink) => {
  const cart = new CartPage(page);
  await cart.goto();
  await cart.checkoutLink.waitFor();
  await tabAteFicarFocado(page, cart.checkoutLink);
  await page.keyboard.press('Enter');
});

When('preencho nome, e-mail e CEP só com teclado e confirmo o pedido', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.nameInput.waitFor();
  await tabAteFicarFocado(page, checkout.nameInput);
  await page.keyboard.type('Maria Silva');
  await page.keyboard.press('Tab');
  await page.keyboard.type('maria@exemplo.com');
  await page.keyboard.press('Tab');
  await page.keyboard.type('01310-100');

  await tabAteFicarFocado(page, checkout.confirmButton);
  await page.keyboard.press('Enter');
});

Then('devo chegar na tela de pedido confirmado sem ter usado o mouse', async ({ page }) => {
  await expect(page).toHaveURL(/\/pedido-confirmado$/);
});

When('navego pelos elementos com Tab', async ({ page }) => {
  outlineStyles = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? window.getComputedStyle(el).outlineStyle : 'none';
    });
    outlineStyles.push(outline);
  }
});

Then('cada elemento focado deve ter um contorno \\(outline\\) visível', async ({}) => {
  for (const outline of outlineStyles) {
    expect(outline).not.toBe('none');
  }
});

When('escaneio a página inicial com o axe-core', async ({ page }) => {
  await new HomePage(page).goto();
  axeResults = await new AxeBuilder({ page }).analyze();
});

When('escaneio a página do carrinho com o axe-core', async ({ page }) => {
  axeResults = await new AxeBuilder({ page }).analyze();
});

When('escaneio a página com o axe-core', async ({ page }) => {
  axeResults = await new AxeBuilder({ page }).analyze();
});

Then('não deve haver violações do tipo {string} ou {string}', async ({}, impactoA, impactoB) => {
  const graves = axeResults.violations.filter((v) => v.impact === impactoA || v.impact === impactoB);
  expect(graves, JSON.stringify(graves, null, 2)).toEqual([]);
});

When('escaneio qualquer página da loja com o axe-core', async ({ page }) => {
  await new HomePage(page).goto();
  axeResults = await new AxeBuilder({ page }).analyze();
});

Then('não deve haver violação do tipo {string} no elemento {string}', async ({}, regra, seletor) => {
  const violacao = axeResults.violations.find(
    (v) => v.id === regra && v.nodes.some((n) => n.target.includes(seletor))
  );
  expect(violacao, `violação "${regra}" encontrada em "${seletor}"`).toBeUndefined();
});

When('olho a ordem dos headings \\(h1, h2, h3...) da página', async ({ page }) => {
  await page.getByText('Resumo do pedido').waitFor(); // espera o carrinho terminar de carregar
  headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1]))
  );
});

Then('a ordem deveria ser sequencial, sem pular nível', async ({}) => {
  expect(headings.length).toBeGreaterThan(0); // garante que a leitura acima não veio vazia
  for (let i = 1; i < headings.length; i++) {
    expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
  }
});
