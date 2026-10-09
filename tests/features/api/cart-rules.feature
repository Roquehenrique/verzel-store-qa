# language: pt

@api
Funcionalidade: Regras de negócio do carrinho aplicadas pela API

  @known-bug @high
  Cenário: CA10.1 - A API deve rejeitar quantidade acima de 5 unidades no cálculo do carrinho
    Quando envio POST /api/carrinho/calcular com quantidade 6 de "P001"
    Então a API deve responder "422" com o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    # Na prática a API responde 200, sem nenhum erro - ver bugs/high/bug-02-quantity-limit-api.md

  @known-bug @high
  Cenário: CA10.2 - A API deve rejeitar quantidade acima de 5 unidades na confirmação do pedido
    Quando envio POST /api/pedidos com quantidade 6 de "P001" e dados de cliente válidos
    Então a API deve responder "422" com o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    # Na prática a API responde 201 e cria o pedido mesmo assim - ver bugs/high/bug-02-quantity-limit-api.md
