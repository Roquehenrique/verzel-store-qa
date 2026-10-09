# language: pt
# Produto usado no exemplo: P001 Camiseta Essencial R$ 59,90

@web
Funcionalidade: Limite de quantidade por produto

  @regression @medium
  Cenário: CA10 - A interface impede adicionar mais de 5 unidades do mesmo produto
    Dado que tenho 5 unidades de "Camiseta Essencial" no carrinho
    Então o botão de aumentar quantidade deve estar desabilitado
    E a mensagem "Limite de 5 unidades por produto." deve ser exibida
