// Page Object da home (vitrine de produtos).
class HomePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  addToCartButton(index) {
    return this.page.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(index);
  }

  async addProductByIndex(index) {
    await this.goto();
    await this.addToCartButton(index).click();
  }
}

module.exports = { HomePage };
