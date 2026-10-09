// Funções auxiliares compartilhadas pelos testes de automação da Verzel Store.

/** Adiciona um produto ao carrinho a partir da home, pelo índice do card (0 = primeiro produto listado). */
async function adicionarProdutoPorIndice(page, indice) {
  await page.goto('/');
  const botoes = page.getByRole('button', { name: 'Adicionar ao carrinho' });
  await botoes.nth(indice).click();
}

/** Adiciona um produto ao carrinho pelo nome exibido no card. */
async function adicionarProdutoPorNome(page, nomeProduto) {
  await page.goto('/');
  const card = page.locator('text=' + nomeProduto).locator('..').locator('..');
  await card.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
}

async function irParaCarrinho(page) {
  await page.goto('/carrinho');
}

async function aplicarCupom(page, codigo) {
  await page.fill('#campo-cupom', codigo);
  await page.click('button:has-text("Aplicar cupom")');
}

async function preencherCheckout(page, { nome, email, cep }) {
  await page.fill('#campo-nome', nome);
  await page.fill('#campo-email', email);
  await page.fill('#campo-cep', cep);
}

module.exports = {
  adicionarProdutoPorIndice,
  adicionarProdutoPorNome,
  irParaCarrinho,
  aplicarCupom,
  preencherCheckout,
};
