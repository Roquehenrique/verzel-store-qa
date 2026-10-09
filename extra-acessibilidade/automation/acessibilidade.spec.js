const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

// Reaproveito os mesmos helpers de navegação dos testes "oficiais" (pasta automation/ lá na
// raiz do projeto). Esse arquivo fica fora da suíte principal de propósito - ver
// extra-acessibilidade/README.md pra entender o porquê.
const { adicionarProdutoPorIndice, irParaCarrinho } = require('../../automation/helpers');

// Uso o axe-core (ferramenta padrão de mercado pra isso) pra escanear as páginas em busca de
// violações de acessibilidade. Os testes abaixo só falham se aparecer algo "critical" ou
// "serious" - violações "moderate" eu documentei como bugs separados (ver extra-acessibilidade/bugs/),
// não deixei travando a suíte porque não impedem o uso do site.

async function semViolacoesGraves(page) {
  const resultado = await new AxeBuilder({ page }).analyze();
  const graves = resultado.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  expect(graves, JSON.stringify(graves, null, 2)).toEqual([]);
}

test.describe('Acessibilidade - scanner automático (axe-core)', () => {
  test('home não tem violações críticas/sérias', async ({ page }) => {
    await page.goto('/');
    await semViolacoesGraves(page);
  });

  test('carrinho não tem violações críticas/sérias', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);
    await semViolacoesGraves(page);
  });

  test('checkout não tem violações críticas/sérias', async ({ page }) => {
    await adicionarProdutoPorIndice(page, 0);
    await irParaCarrinho(page);
    await page.click('text=Finalizar compra');
    await semViolacoesGraves(page);
  });
});

// Fica apertando Tab até o elemento passado ficar focado, ou desiste depois de várias tentativas.
// Uso isso em vez de contar um número fixo de Tabs porque a ordem exata muda dependendo da
// página (SPA às vezes reseta o foco de um jeito diferente de uma navegação normal).
async function tabAte(page, locatorAlvo, maxTentativas = 20) {
  for (let i = 0; i < maxTentativas; i++) {
    const jaFocado = await locatorAlvo.evaluate((el) => el === document.activeElement).catch(() => false);
    if (jaFocado) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('Não consegui chegar nesse elemento navegando só com Tab');
}

test.describe('Acessibilidade - navegação só com teclado', () => {
  test('dá pra comprar do início ao fim sem usar o mouse', async ({ page }) => {
    await page.goto('/');
    const botaoAdicionar = page.getByRole('button', { name: 'Adicionar ao carrinho' }).first();
    await botaoAdicionar.waitFor();

    await tabAte(page, botaoAdicionar);
    await page.keyboard.press('Enter');

    await irParaCarrinho(page);
    const linkFinalizar = page.getByRole('link', { name: 'Finalizar compra' });
    await linkFinalizar.waitFor();

    await tabAte(page, linkFinalizar);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/checkout$/);

    // Preenche o formulário só com teclado
    const campoNome = page.locator('#campo-nome');
    await campoNome.waitFor();
    await tabAte(page, campoNome);
    await page.keyboard.type('Maria Silva');
    await page.keyboard.press('Tab');
    await page.keyboard.type('maria@exemplo.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('01310-100');

    const botaoConfirmar = page.getByRole('button', { name: 'Confirmar pedido' });
    await tabAte(page, botaoConfirmar);
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/pedido-confirmado$/);
  });
});
