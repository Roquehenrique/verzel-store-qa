// Page Object do checkout.
class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  get nameInput() {
    return this.page.locator('#campo-nome');
  }

  get emailInput() {
    return this.page.locator('#campo-email');
  }

  get zipInput() {
    return this.page.locator('#campo-cep');
  }

  get confirmButton() {
    return this.page.getByRole('button', { name: 'Confirmar pedido' });
  }

  // Acesso genérico a um campo pelo nome ("nome", "email" ou "cep") - usado quando o cenário
  // testa um campo de cada vez (ex: validação), em vez de preencher o formulário inteiro.
  field(name) {
    return { nome: this.nameInput, email: this.emailInput, cep: this.zipInput }[name];
  }

  async fillCustomerData({ nome, email, cep }) {
    await this.nameInput.fill(nome);
    await this.emailInput.fill(email);
    await this.zipInput.fill(cep);
  }

  async confirm() {
    await this.confirmButton.click();
  }
}

module.exports = { CheckoutPage };
