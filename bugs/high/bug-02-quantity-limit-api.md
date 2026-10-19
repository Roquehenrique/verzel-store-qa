# BUG-02 — A API deixa passar mais de 5 unidades do mesmo produto

**Severidade:** High
**Critério de aceite violado:** CA10 — *"Cada produto pode ter no máximo 5 unidades por pedido. A regra vale para a interface e para a API."* A documentação também lista um erro específico pra isso (`422 QUANTIDADE_MAXIMA_EXCEDIDA`), mas ele nunca aparece.

### Como reproduzir

Calculando o carrinho com 6 unidades de um produto:
```bash
curl -i -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"produtoId":"P001","quantidade":6}]}'
```

Confirmando um pedido com 6 unidades:
```bash
curl -i -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[{"produtoId":"P001","quantidade":6}]}'
```

### Esperado
Nos dois casos, a API deveria recusar com `422 QUANTIDADE_MAXIMA_EXCEDIDA`.

### O que acontece
- No cálculo do carrinho, a API responde **200** normalmente, como se 6 unidades fosse uma quantidade válida (testei até com 100 unidades, mesmo resultado).
- Na confirmação do pedido, a API responde **201** e **cria o pedido de verdade** com 6 unidades, gerando um número de pedido válido (peguei `VZ-756695` num dos testes).

Ou seja: na tela do site o limite de 5 funciona (o botão "+" trava em 5), mas se alguém chamar
a API diretamente (sem passar pela tela), dá pra pedir quantas unidades quiser. Como a própria
documentação diz que a regra vale tanto pra interface quanto pra API, isso é um bug.

### Evidência de API (bruta)
Request e `curl -i` completos, gerados por `scripts/capture-api-evidence.sh`:
- [`evidence/api/bug-02-calcular-quantidade-6.txt`](../../evidence/api/bug-02-calcular-quantidade-6.txt) — `HTTP 200` no cálculo com 6 unidades
- [`evidence/api/bug-02-pedido-quantidade-6.txt`](../../evidence/api/bug-02-pedido-quantidade-6.txt) — `HTTP 201` e número de pedido gerado com 6 unidades

O limite é por produto (ver [AMB-06](../../docs/ambiguidades.md#amb-06)). O fato de o número do
pedido ser fictício é comportamento esperado do ambiente ([AMB-08](../../docs/ambiguidades.md#amb-08)).
