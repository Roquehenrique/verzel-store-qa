const { test, expect } = require('@playwright/test');
const { adicionarProdutoPorIndice, irParaCarrinho } = require('../helpers');

// Obs: o teste do subtotal exatamente R$ 200,00 (fronteira da regra de frete grátis) eu não
// deixei automatizado porque achei um bug nesse valor exato
// (ver bugs/High/bug-01-frete-gratis-subtotal-200.md). Preferi deixar só documentado lá,
// com print, pra não ficar um teste quebrado aqui.

test.describe('Frete grátis', () => {
  test('CA06 - subtotal acima de R$ 200,00 garante frete grátis', async ({ page }) => {
    // Mochila Urbana 20L (R$ 100,00) + Camiseta Essencial (R$ 59,90) + Garrafa Térmica (R$ 50,00) = R$ 209,90
    await adicionarProdutoPorIndice(page, 4);
    await adicionarProdutoPorIndice(page, 0);
    await adicionarProdutoPorIndice(page, 7);
    await irParaCarrinho(page);

    await expect(page.locator('[data-valor="subtotal"]')).toHaveText('R$ 209,90');
    await expect(page.locator('[data-valor="frete"]')).toHaveText('Grátis');
  });

  test('CA07 - subtotal abaixo de R$ 200,00 cobra frete fixo e avisa quanto falta', async ({ page }) => {
    // Calça Jeans Slim (R$ 139,90) + 2x Kit 3 Pares de Meias (R$ 29,90) = R$ 199,70
    await adicionarProdutoPorIndice(page, 1);
    await adicionarProdutoPorIndice(page, 5);
    await adicionarProdutoPorIndice(page, 5);
    await irParaCarrinho(page);

    await expect(page.locator('[data-valor="subtotal"]')).toHaveText('R$ 199,70');
    await expect(page.locator('[data-valor="frete"]')).toHaveText('R$ 19,90');
    await expect(page.getByText('Faltam R$ 0,30 para o frete grátis.')).toBeVisible();
  });
});
