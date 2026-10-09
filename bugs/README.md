# Bugs encontrados — Entrega VZS-142 (Cupom de desconto e frete grátis)

Ambiente testado: https://verzel-store.qa-test-verzel-store.workers.dev/
Data da execução: 08/10/2026

Encontrei 3 bugs, organizados em pastas por severidade (`high`, `medium`, `low`). Nenhum bug de
severidade Medium apareceu nessa rodada de testes, por isso essa pasta não existe ainda no
repositório.

| ID | Título | Severidade | Arquivo |
|----|--------|-----------|---------|
| BUG-01 | Frete grátis não é liberado quando subtotal == R$ 200,00 | High | [`high/bug-01-free-shipping-subtotal-200.md`](high/bug-01-free-shipping-subtotal-200.md) |
| BUG-02 | API não valida o limite de 5 unidades por produto | High | [`high/bug-02-quantity-limit-api.md`](high/bug-02-quantity-limit-api.md) |
| BUG-03 | Item sem `produtoId` retorna código de erro incorreto | Low | [`low/bug-03-missing-product-id-wrong-error-code.md`](low/bug-03-missing-product-id-wrong-error-code.md) |

Os dois bugs `High` quebram regras que estão escritas explicitamente na documentação (critérios
de aceite CA06 e CA10). O `Low` é mais um detalhe de código/mensagem de erro da API, que não
chega a afetar quem está comprando pelo site.

Cada arquivo de bug tem: critério de aceite violado (quando aplicável), passos pra reproduzir
(inclusive comando `curl` pronto pra copiar e colar), o que era esperado, o que realmente
acontece, e evidência (print, quando tem).

> Também encontrei 2 bugs de acessibilidade numa rodada de teste extra que fiz por conta
> própria (não fazia parte do que foi pedido no card). Eles ficam separados em
> [`extra-accessibility/bugs/`](../extra-accessibility/bugs/), pra não misturar com o que foi
> efetivamente pedido na vaga.
