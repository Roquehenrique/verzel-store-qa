# Cenários de teste — Entrega VZS-142

Cenários em Gherkin levantados a partir da documentação da entrega:
https://verzel-store.qa-test-verzel-store.workers.dev/documentacao

Separei em um arquivo `.feature` por funcionalidade (mesma divisão que usei nos testes
automatizados em `automation/tests/`), pra ficar mais fácil de achar o que procura.

| Arquivo | Funcionalidade | Critérios cobertos |
|---|---|---|
| [`cupom.feature`](cupom.feature) | Cupom de desconto no carrinho | CA01 a CA05.1 |
| [`frete.feature`](frete.feature) | Frete grátis | CA06 a CA09 |
| [`quantidade.feature`](quantidade.feature) | Limite de quantidade por produto | CA10 a CA10.2 |
| [`arredondamento.feature`](arredondamento.feature) | Arredondamento de valores | CA11 |
| [`checkout.feature`](checkout.feature) | Validação de dados do cliente e fluxo de compra | — |
| [`api.feature`](api.feature) | Códigos de erro da API | — |
| [`ambiente-teste.feature`](ambiente-teste.feature) | Particularidades do ambiente (não são bugs) | — |

> O cenário de acessibilidade não está aqui de propósito — foi um teste extra que fiz por conta
> própria, não pedido no card, e fica separado em [`extra-acessibilidade/`](../extra-acessibilidade/).

## Dados usados nos exemplos

**Produtos**

| Id | Produto | Preço |
|---|---|---|
| P001 | Camiseta Essencial | R$ 59,90 |
| P002 | Calça Jeans Slim | R$ 139,90 |
| P003 | Tênis Casual Urbano | R$ 189,90 |
| P004 | Boné Aba Curva | R$ 49,90 |
| P005 | Mochila Urbana 20L | R$ 100,00 |
| P006 | Kit 3 Pares de Meias | R$ 29,90 |
| P007 | Jaqueta Corta-Vento | R$ 229,90 |
| P008 | Garrafa Térmica 750ml | R$ 50,00 |

**Cupons**

| Código | Desconto | Situação |
|---|---|---|
| BEMVINDO10 | 10% | Válido |
| VERAO2026 | 15% | Expirado em 31/03/2026 |
