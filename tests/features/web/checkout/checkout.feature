# language: pt

@web
Funcionalidade: Validação de dados do cliente no checkout

  @regression @high
  Esquema do Cenário: Dados obrigatórios e seus formatos são validados antes de confirmar o pedido
    Dado que estou na tela de checkout com um carrinho válido
    Quando preencho o campo "<campo>" com "<valor_invalido>"
    E tento confirmar o pedido
    Então devo ver a mensagem de erro "<mensagem_esperada>"
    E o pedido não deve ser criado

    Exemplos:
      | campo  | valor_invalido      | mensagem_esperada                 |
      | nome   | Maria               | Informe nome e sobrenome.         |
      | email  | maria-arroba-ponto  | Informe um e-mail válido.         |
      | cep    | ABCDE-123           | Informe um CEP com 8 dígitos.     |

  @regression @medium
  Cenário: CEP aceita formato com e sem hífen
    Dado que estou na tela de checkout com um carrinho válido
    Quando preencho nome, email e CEP "01310100" (sem hífen)
    E confirmo o pedido
    Então o pedido deve ser criado com sucesso

  @regression @critical
  Cenário: Fluxo de compra completo com cupom e frete grátis (ponta a ponta)
    Dado que adiciono produtos ao carrinho até o subtotal ultrapassar R$ 200,00
    E aplico o cupom "BEMVINDO10"
    Quando preencho os dados de entrega corretamente
    E confirmo o pedido
    Então devo ver a tela "Pedido confirmado" com um número no formato "VZ-000000"
    E o carrinho deve ser esvaziado
