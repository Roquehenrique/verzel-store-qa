# language: pt
# A API fica em /api. Requisições e respostas são sempre JSON.
# "none" na coluna do corpo significa que nenhum corpo é enviado na requisição.

@api
Funcionalidade: Comportamento de erros da API (/api)

  @regression @high
  Esquema do Cenário: A API responde com o código de erro documentado para cada entrada inválida
    Quando envio "<metodo>" para "<rota>" com o corpo <corpo>
    Então a API deve responder "<status>" com o código "<codigo>"

    Exemplos:
      | metodo | rota                   | corpo                                                                                  | status | codigo                 |
      | POST   | /api/carrinho/calcular | not-json                                                                               | 400    | JSON_INVALIDO          |
      | GET    | /api/rota-inexistente  | none                                                                                    | 404    | ROTA_NAO_ENCONTRADA    |
      | GET    | /api/produtos/P999     | none                                                                                    | 404    | PRODUTO_NAO_ENCONTRADO |
      | DELETE | /api/produtos          | none                                                                                    | 405    | METODO_NAO_PERMITIDO   |
      | POST   | /api/carrinho/calcular | {"itens":[]}                                                                           | 422    | ITENS_OBRIGATORIOS     |
      | POST   | /api/carrinho/calcular | {"itens":["P001"]}                                                                     | 422    | ITEM_INVALIDO          |
      | POST   | /api/carrinho/calcular | {"itens":[{"produtoId":"P999","quantidade":1}]}                                        | 422    | PRODUTO_NAO_ENCONTRADO |
      | POST   | /api/carrinho/calcular | {"itens":[{"produtoId":"P001","quantidade":1},{"produtoId":"P001","quantidade":2}]}    | 422    | ITEM_DUPLICADO         |
      | POST   | /api/carrinho/calcular | {"itens":[{"produtoId":"P001","quantidade":0}]}                                        | 422    | QUANTIDADE_INVALIDA    |
      | POST   | /api/carrinho/calcular | {"itens":[{"produtoId":"P001","quantidade":-1}]}                                       | 422    | QUANTIDADE_INVALIDA    |
      | POST   | /api/carrinho/calcular | {"itens":[{"produtoId":"P001","quantidade":1.5}]}                                      | 422    | QUANTIDADE_INVALIDA    |
      | POST   | /api/carrinho/calcular | {"itens":[{"produtoId":"P001","quantidade":"2"}]}                                      | 422    | QUANTIDADE_INVALIDA    |
      | POST   | /api/pedidos           | {"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[{"produtoId":"P001","quantidade":1}],"cupom":"NAOEXISTE"} | 422 | CUPOM_INVALIDO |
      | POST   | /api/pedidos           | {"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[{"produtoId":"P001","quantidade":1}],"cupom":"VERAO2026"} | 422 | CUPOM_EXPIRADO |
      | POST   | /api/pedidos           | {"itens":[{"produtoId":"P001","quantidade":1}]}                                        | 422    | DADOS_INVALIDOS        |

  @regression @medium
  Cenário: Cupom inválido ou expirado em /api/carrinho/calcular não gera erro HTTP
    Quando envio POST /api/carrinho/calcular com um cupom inexistente
    Então a API deve responder 200
    E o campo "cupom.aplicado" deve ser "false"
    E o campo "cupom.mensagem" deve conter o motivo

  @regression @low
  Cenário: Consultar produto existente pelo id
    Quando envio GET /api/produtos/P001
    Então a API deve responder 200 com os dados do produto "Camiseta Essencial"
