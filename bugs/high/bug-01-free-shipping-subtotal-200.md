# BUG-01 — Frete grátis não é liberado quando o subtotal é exatamente R$ 200,00

**Severidade:** High
**Critério de aceite violado:** CA06 — *"O frete é grátis para compras com subtotal a partir de R$ 200,00, inclusive."*

A documentação deixa bem claro que R$ 200,00 conta como "a partir de", ou seja, deveria dar
frete grátis. Mas testando esse valor exato, o frete continua sendo cobrado.

### Como reproduzir
1. Adicione 2 unidades de "Mochila Urbana 20L" (R$ 100,00 cada) ao carrinho — subtotal fecha em R$ 200,00 certinho.
2. Veja o resumo do pedido no carrinho.

Também dá pra testar direto na API:
```bash
curl -X POST https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular \
  -H "Content-Type: application/json" \
  -d '{"itens":[{"produtoId":"P005","quantidade":2}]}'
```

### Esperado
Com subtotal de R$ 200,00, o frete deveria vir grátis (`freteGratis: true`, `frete: 0`).

### O que acontece
```json
{
  "subtotal": 200,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9
}
```
O frete de R$ 19,90 é cobrado mesmo com o subtotal batendo exatamente o limite. Testei duas
vezes pra garantir que não foi algo pontual, e deu o mesmo resultado nas duas.

Pra efeito de comparação: um subtotal de R$ 209,90 (um pouco acima) já dá frete grátis
corretamente, e um subtotal de R$ 199,70 (um pouco abaixo) corretamente cobra o frete. Então o
problema parece estar só nesse valor exato de R$ 200,00 — como se a comparação no sistema
fosse "maior que 200" em vez de "maior ou igual a 200".

### Evidência
`evidence/exploration/15-bug-free-shipping-200.png` — carrinho com 2 Mochilas, subtotal R$ 200,00, mostrando o frete de R$ 19,90 cobrado em vez de grátis.

### Evidência de API (bruta)
Request e `curl -i` completos (status, headers e corpo), gerados por `scripts/capture-api-evidence.sh`:
- [`evidence/api/bug-01-subtotal-200.txt`](../../evidence/api/bug-01-subtotal-200.txt) — o bug (R$ 200,00 → `frete: 19.9`, `freteGratis: false`)
- [`evidence/api/bug-01-controle-subtotal-199-70.txt`](../../evidence/api/bug-01-controle-subtotal-199-70.txt) — controle logo abaixo (frete cobrado, correto)
- [`evidence/api/bug-01-controle-subtotal-209-90.txt`](../../evidence/api/bug-01-controle-subtotal-209-90.txt) — controle logo acima (frete grátis, correto)

### Ambiguidade relacionada
`valorFaltanteFreteGratis: 0` junto com `freteGratis: false` é contraditório — ver [AMB-04](../../docs/ambiguidades.md#amb-04).
