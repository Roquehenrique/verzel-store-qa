const { test, expect } = require('@playwright/test');
const { adicionarProdutoPorIndice, irParaCarrinho, preencherCheckout } = require('../helpers');

test.describe('Checkout', () => {
  test('nome sem sobrenome bloqueia a confirmação do pedido', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);
    await page.click('text=Finalizar compra');

    await preencherCheckout(page, { nome: 'Maria', email: 'maria@exemplo.com', cep: '01310-100' });
    await page.click('button:has-text("Confirmar pedido")');

    await expect(page.getByText('Informe nome e sobrenome.')).toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);
  });

  test('fluxo completo de compra com cupom e frete grátis é concluído com sucesso', async ({ page }) => {
    // Mochila Urbana 20L (R$ 100,00) + Jaqueta Corta-Vento (R$ 229,90) -> subtotal bem acima de R$ 200,00
    await adicionarProdutoPorIndice(page, 4);
    await adicionarProdutoPorIndice(page, 6);
    await irParaCarrinho(page);

    await page.fill('#campo-cupom', 'BEMVINDO10');
    await page.click('button:has-text("Aplicar cupom")');
    await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
    await expect(page.locator('[data-valor="frete"]')).toHaveText('Grátis');

    await page.click('text=Finalizar compra');
    await preencherCheckout(page, { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' });
    await page.click('button:has-text("Confirmar pedido")');

    await expect(page).toHaveURL(/\/pedido-confirmado$/);
    await expect(page.getByText(/Pedido VZ-\d{6}/)).toBeVisible();
    await expect(page.getByText('Obrigado, Maria.')).toBeVisible();

    // Carrinho deve ter sido esvaziado após a confirmação.
    await page.goto('/carrinho');
    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();
  });
});
