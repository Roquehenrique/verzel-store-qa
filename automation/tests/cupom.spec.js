const { test, expect } = require('@playwright/test');
const { adicionarProdutoPorIndice, irParaCarrinho, aplicarCupom } = require('../helpers');

// Produto usado como base: Camiseta Essencial (índice 0), R$ 59,90.

test.describe('Cupom de desconto', () => {
  test('CA01 - cupom válido aplica 10% de desconto sobre o subtotal', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);

    await aplicarCupom(page, 'BEMVINDO10');

    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
    await expect(page.locator('[data-valor="desconto"]')).toHaveText('- R$ 5,99');
    await expect(page.locator('[data-valor="total"]')).toHaveText('R$ 73,81'); // 59,90 - 5,99 + 19,90
  });

  test('CA02 - código do cupom ignora maiúsculas/minúsculas e espaços nas pontas', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);

    await aplicarCupom(page, '  bemvindo10  ');

    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
    await expect(page.locator('[data-valor="desconto"]')).toHaveText('- R$ 5,99');
  });

  test('CA03 - cupom inexistente exibe mensagem e não aplica desconto', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);

    await aplicarCupom(page, 'NAOEXISTE');

    await expect(page.getByText('Cupom inválido.')).toBeVisible();
    await expect(page.locator('[data-valor="desconto"]')).toHaveText('R$ 0,00');
  });

  test('CA04 - cupom expirado exibe mensagem e não aplica desconto', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);

    await aplicarCupom(page, 'VERAO2026');

    await expect(page.getByText('Cupom expirado.')).toBeVisible();
  });

  test('CA05 - após aplicar um cupom, não há campo para aplicar um segundo sem remover o atual', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);

    await aplicarCupom(page, 'BEMVINDO10');
    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();

    await expect(page.locator('#campo-cupom')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Remover cupom' })).toBeVisible();
  });
});
