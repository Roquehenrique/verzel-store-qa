# language: pt
# Produto usado nos exemplos: P001 Camiseta Essencial R$ 59,90

Funcionalidade: Limite de quantidade por produto

  Cenário: CA10 - A interface impede adicionar mais de 5 unidades do mesmo produto
    Dado que tenho 5 unidades de "Camiseta Essencial" no carrinho
    Então o botão de aumentar quantidade deve estar desabilitado
    E a mensagem "Limite de 5 unidades por produto." deve ser exibida

  Cenário: CA10.1 - A API deve rejeitar quantidade acima de 5 unidades no cálculo do carrinho
    Quando envio POST /api/carrinho/calcular com quantidade 6 de "P001"
    Então a API deve responder 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    # Na prática a API responde 200, sem nenhum erro - ver bugs/High/bug-02-limite-5-unidades-api.md

  Cenário: CA10.2 - A API deve rejeitar quantidade acima de 5 unidades na confirmação do pedido
    Quando envio POST /api/pedidos com quantidade 6 de "P001" e dados de cliente válidos
    Então a API deve responder 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    # Na prática a API responde 201 e cria o pedido mesmo assim - ver bugs/High/bug-02-limite-5-unidades-api.md
