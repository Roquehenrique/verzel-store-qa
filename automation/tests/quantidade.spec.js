const { test, expect } = require('@playwright/test');
const { adicionarProdutoPorIndice, irParaCarrinho } = require('../helpers');

test('CA10 - interface impede adicionar mais de 5 unidades do mesmo produto', async ({ page }) => {
  await adicionarProdutoPorIndice(page, 0); // Camiseta Essencial, inicia com 1 unidade
  await irParaCarrinho(page);

  const botaoAumentar = page.getByLabel('Aumentar quantidade de Camiseta Essencial');

  // Já está com 1 unidade; precisa de mais 4 cliques para chegar a 5.
  for (let i = 0; i < 4; i++) {
    await expect(botaoAumentar).toBeEnabled();
    await botaoAumentar.click();
    await page.waitForTimeout(400); // aguarda ida e volta da API de cálculo
  }

  await expect(botaoAumentar).toBeDisabled();
  await expect(page.getByText('Limite de 5 unidades por produto.')).toBeVisible();
  await expect(page.locator('[data-valor="subtotal"]')).toHaveText('R$ 299,50'); // 5 x R$ 59,90
});
