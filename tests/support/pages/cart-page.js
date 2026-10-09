// Page Object do carrinho. Concentra todos os seletores dessa página - quem usa esse
// arquivo não precisa saber que o subtotal é um elemento com `data-valor="subtotal"`.
class CartPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/carrinho');
  }

  get subtotal() {
    return this.page.locator('[data-valor="subtotal"]');
  }

  get discount() {
    return this.page.locator('[data-valor="desconto"]');
  }

  get shipping() {
    return this.page.locator('[data-valor="frete"]');
  }

  get total() {
    return this.page.locator('[data-valor="total"]');
  }

  get couponInput() {
    return this.page.locator('#campo-cupom');
  }

  get applyCouponButton() {
    return this.page.getByRole('button', { name: 'Aplicar cupom' });
  }

  get removeCouponButton() {
    return this.page.getByRole('button', { name: 'Remover cupom' });
  }

  get checkoutLink() {
    return this.page.getByRole('link', { name: 'Finalizar compra' });
  }

  get emptyCartMessage() {
    return this.page.getByText('Seu carrinho está vazio');
  }

  // Sem nome, pega o único botão de aumentar quantidade visível (cenários com 1 produto).
  increaseQuantityButton(productName) {
    return productName
      ? this.page.getByLabel(`Aumentar quantidade de ${productName}`)
      : this.page.getByRole('button', { name: /Aumentar quantidade/ });
  }

  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  async removeCoupon() {
    await this.removeCouponButton.click();
  }

  async goToCheckout() {
    await this.checkoutLink.click();
  }

  async increaseQuantity(productName, times = 1) {
    const button = this.increaseQuantityButton(productName);
    for (let i = 0; i < times; i++) {
      await button.click();
      await this.page.waitForTimeout(400); // espera a ida e volta da API de cálculo
    }
  }
}

module.exports = { CartPage };
