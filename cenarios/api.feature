# language: pt

Funcionalidade: Comportamento de erros da API (/api)

  Esquema do Cenário: A API responde com o código de erro documentado para cada entrada inválida
    Quando envio "<metodo>" para "<rota>" com o corpo "<corpo>"
    Então a API deve responder "<status>" com o código "<codigo>"

    Exemplos:
      | metodo | rota                     | corpo                                                          | status | codigo                  |
      | POST   | /api/carrinho/calcular   | corpo que não é um JSON válido                                  | 400    | JSON_INVALIDO           |
      | GET    | /api/rota-inexistente    | (n/a)                                                           | 404    | ROTA_NAO_ENCONTRADA     |
      | GET    | /api/produtos/P999       | (n/a)                                                           | 404    | PRODUTO_NAO_ENCONTRADO  |
      | DELETE | /api/produtos            | (n/a)                                                           | 405    | METODO_NAO_PERMITIDO    |
      | POST   | /api/carrinho/calcular   | itens: []                                                       | 422    | ITENS_OBRIGATORIOS      |
      | POST   | /api/carrinho/calcular   | itens: ["P001"] (item não é objeto)                             | 422    | ITEM_INVALIDO           |
      | POST   | /api/carrinho/calcular   | itens com produtoId inexistente                                 | 422    | PRODUTO_NAO_ENCONTRADO  |
      | POST   | /api/carrinho/calcular   | mesmo produtoId repetido duas vezes na lista                     | 422    | ITEM_DUPLICADO          |
      | POST   | /api/carrinho/calcular   | quantidade 0                                                     | 422    | QUANTIDADE_INVALIDA     |
      | POST   | /api/carrinho/calcular   | quantidade -1                                                    | 422    | QUANTIDADE_INVALIDA     |
      | POST   | /api/carrinho/calcular   | quantidade 1.5 (decimal)                                         | 422    | QUANTIDADE_INVALIDA     |
      | POST   | /api/carrinho/calcular   | quantidade "2" (string)                                          | 422    | QUANTIDADE_INVALIDA     |
      | POST   | /api/pedidos             | cupom inexistente                                                | 422    | CUPOM_INVALIDO          |
      | POST   | /api/pedidos             | cupom expirado (VERAO2026)                                       | 422    | CUPOM_EXPIRADO          |
      | POST   | /api/pedidos             | cliente com nome, email e cep ausentes                           | 422    | DADOS_INVALIDOS         |

  Cenário: Cupom inválido ou expirado em /api/carrinho/calcular não gera erro HTTP
    Quando envio POST /api/carrinho/calcular com um cupom inexistente
    Então a API deve responder 200
    E o campo "cupom.aplicado" deve ser "false"
    E o campo "cupom.mensagem" deve conter o motivo

  Cenário: Consultar produto existente pelo id
    Quando envio GET /api/produtos/P001
    Então a API deve responder 200 com os dados do produto "Camiseta Essencial"
