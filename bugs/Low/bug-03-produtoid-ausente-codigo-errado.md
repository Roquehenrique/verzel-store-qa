# BUG-03 — Mensagem de erro errada quando falta o campo `produtoId`

**Severidade:** Low

A tabela de códigos de erro da documentação diz que `422 ITEM_INVALIDO` deve aparecer quando
*"um item não é um objeto com produtoId e quantidade"*. Testei mandar um item sem o campo
`produtoId`:

```bash
curl -i -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"quantidade":1}]}'
```

### Esperado
`422 ITEM_INVALIDO`.

### O que acontece
```json
{"erro":{"codigo":"PRODUTO_NAO_ENCONTRADO","mensagem":"Produto undefined não encontrado.","campo":"itens[0].produtoId"}}
```
Em vez de validar que o item está incompleto, a API trata o `produtoId` ausente como se fosse
literalmente o texto `"undefined"` e tenta buscar um produto com esse nome — daí a mensagem
estranha "Produto undefined não encontrado".

### Por que marquei como Low
Isso é só um código/mensagem de erro técnico que aparece numa chamada de API malformada — não
é algo que o cliente final vai ver navegando no site normalmente. A documentação tem uma parte
meio ambígua aqui (não deixa 100% claro o que conta como "item inválido" vs. "produto não
encontrado"), e documentei minha interpretação conforme pedido nas regras do teste.
