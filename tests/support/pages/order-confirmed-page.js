// Page Object da tela de pedido confirmado.
class OrderConfirmedPage {
  constructor(page) {
    this.page = page;
  }

  get orderNumber() {
    return this.page.getByText(/Pedido VZ-\d{6}/);
  }
}

module.exports = { OrderConfirmedPage };
