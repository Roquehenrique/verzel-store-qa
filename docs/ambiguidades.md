# Registro de ambiguidades e interpretações adotadas

Aqui ficam as partes da documentação da entrega VZS-142 que deixam margem pra mais de uma
leitura, ou que não dão pra provar na prática, e **qual interpretação eu adotei** em cada uma.
Os cenários (`tests/features/`) e os bugs (`bugs/`) só apontam pro ID daqui (ex: `AMB-01`),
em vez de repetirem a explicação.

Num time de verdade, cada item "Aguardando validação" viraria uma pergunta pro PO/dev, e a
resposta atualizaria a coluna **Status**. Se a resposta for diferente da minha interpretação,
a coluna **Impacto se estiver errada** diz o que muda.

Legenda de status: ✅ Sem ambiguidade real (confirmado na doc ou no comportamento) ·
❓ Aguardando validação · ⚠️ Limitação do ambiente (não dá pra testar)

## Resumo

| ID | Tema | Status |
|---|---|---|
| [AMB-01](#amb-01) | `ITEM_INVALIDO` x `PRODUTO_NAO_ENCONTRADO` quando falta `produtoId` | ❓ |
| [AMB-02](#amb-02) | O que "arredondar para 2 casas" significa (modo de arredondamento) | ⚠️ |
| [AMB-03](#amb-03) | Base de cálculo do frete grátis (subtotal antes do desconto) | ✅ |
| [AMB-04](#amb-04) | "Faltante para frete grátis" no limite de R$ 200,00 | ❓ |
| [AMB-05](#amb-05) | Cupom: quais espaços são ignorados e o que acontece com cupom vazio | ❓ |
| [AMB-06](#amb-06) | Limite de 5 unidades: por produto ou por pedido, e o que a tela faz | ✅ |
| [AMB-07](#amb-07) | Cupom inválido: erro na API de cálculo x erro na API de pedido | ✅ |
| [AMB-08](#amb-08) | Comportamentos do ambiente que não são bugs (carrinho por aba, pedidos fictícios) | ✅ |

---

## AMB-01

**Item sem `produtoId` deve dar `ITEM_INVALIDO` ou `PRODUTO_NAO_ENCONTRADO`?**

- **Trecho da documentação:** tabela de erros — `ITEM_INVALIDO`: *"Um item não é um objeto com
  produtoId e quantidade."* / `PRODUTO_NAO_ENCONTRADO`: *"Um item referencia um produto
  inexistente."*
- **Por que é ambíguo:** `{"quantidade":1}` é um objeto, mas **não tem** `produtoId`. Lendo "não é
  um objeto com produtoId e quantidade", ele deveria cair em `ITEM_INVALIDO`. Mas dá pra ler
  também como "o item é um objeto, só referencia um produto que não existe".
- **Interpretação adotada:** `ITEM_INVALIDO`. O item está **incompleto**, e não "referencia um
  produto inexistente" (ele nem referencia produto nenhum). A resposta real
  (`Produto undefined não encontrado.`) trata a ausência como se fosse o texto `"undefined"`.
- **Decisão no teste:** registrei como **BUG-03, severidade Low** (justamente por causa da
  ambiguidade e por não afetar o cliente final).
- **Impacto se estiver errada:** o BUG-03 deixa de ser bug e vira comportamento aceitável; a
  linha da tabela de exemplos de `error-handling.feature` não muda.
- **Onde aparece:** [`bugs/low/bug-03-missing-product-id-wrong-error-code.md`](../bugs/low/bug-03-missing-product-id-wrong-error-code.md) ·
  evidência em [`evidence/api/bug-03-item-sem-produtoid.txt`](../evidence/api/bug-03-item-sem-produtoid.txt)
  (e o controle `bug-03-controle-item-nao-objeto.txt`, que mostra `ITEM_INVALIDO` funcionando
  pra outro tipo de item inválido).
- **Status:** ❓ Aguardando validação (PO/dev).

## AMB-02

**CA11 — "Todos os valores são arredondados para 2 casas decimais": arredondar como?**

- **Trecho da documentação:** *CA11: "Todos os valores são arredondados para 2 casas decimais."*
- **Por que é ambíguo:** a doc não diz o modo (meio pra cima, meio pro par, truncar). Só
  apareceria diferença em valores terminando em `,x5` depois do cálculo.
- **O que descobri:** com os dados fixos (todos os preços terminam em `,90` ou `,00`, máximo de
  5 por produto, cupom único de 10%), **nenhum subtotal alcançável gera esse caso**. Então a
  diferença entre os modos de arredondamento nunca aparece.
- **Interpretação adotada:** testar só o que dá — o desconto de R$ 23,97 (sobre R$ 239,70) e
  que todos os valores exibidos têm 2 casas. O modo de arredondamento fica **sem teste**.
- **Impacto se estiver errada:** nenhum no que é testável hoje. Se o catálogo ou os cupons
  mudarem (ex: cupom de 15% — o `VERAO2026` é de 15% e expirado), esse caso precisa de cenário novo.
- **Onde aparece:** [`tests/features/web/cart/rounding.feature`](../tests/features/web/cart/rounding.feature) ·
  [`execution/execution-report.md`](../execution/execution-report.md) (seção Arredondamento).
- **Status:** ⚠️ Limitação do ambiente.

## AMB-03

**CA08 — o frete grátis considera o subtotal antes ou depois do desconto?**

- **Trecho da documentação:** *CA08: "A regra do frete grátis considera o subtotal antes do
  desconto do cupom."* e, em Regras de cálculo, *"Frete: R$ 0,00 quando o subtotal é igual ou
  maior que R$ 200,00"*.
- **Por que parecia ambíguo:** "subtotal" poderia ser lido como o valor já com desconto. O CA08
  resolve: é o valor **antes** do desconto.
- **Interpretação adotada:** a documentada. Verifiquei que o sistema faz isso (subtotal R$ 239,70
  com cupom de 10% → desconto R$ 23,97, frete R$ 0, total R$ 215,73).
- **Onde aparece:** CA08 em [`shipping.feature`](../tests/features/web/cart/shipping.feature).
- **Status:** ✅ Sem ambiguidade (a doc é explícita; mantido aqui pra deixar a decisão visível).

## AMB-04

**`valorFaltanteFreteGratis` quando o subtotal é exatamente R$ 200,00**

- **Trecho da documentação:** *"Faltante para frete grátis: R$ 200,00 menos o subtotal, nunca
  menor que zero."*
- **Por que é ambíguo:** com subtotal de R$ 200,00 o faltante é `0`, e a mensagem "Faltam R$ 0,00
  para o frete grátis" **não faz sentido** se o frete foi cobrado. A doc não diz o que o carrinho
  deve exibir nesse caso.
- **O que acontece hoje:** a API devolve `valorFaltanteFreteGratis: 0` **e** `freteGratis: false`
  ao mesmo tempo (ver BUG-01) — uma combinação contraditória.
- **Interpretação adotada:** a contradição é **consequência do BUG-01**, não um bug separado. Se
  o BUG-01 for corrigido (R$ 200,00 → frete grátis), a combinação `faltante: 0` + `freteGratis:
  true` fica coerente. Não abri bug próprio.
- **Impacto se estiver errada:** se a correção do BUG-01 mantiver o frete cobrado em R$ 200,00,
  vira um segundo bug (mensagem/faltante incoerentes).
- **Onde aparece:** [`bug-01`](../bugs/high/bug-01-free-shipping-subtotal-200.md) ·
  [`evidence/api/bug-01-subtotal-200.txt`](../evidence/api/bug-01-subtotal-200.txt).
- **Status:** ❓ Aguardando validação.

## AMB-05

**CA02 — quais "espaços" são ignorados e o que fazer com cupom vazio**

- **Trecho da documentação:** *CA02: "...espaços no início e no fim são ignorados."*
- **Por que é ambíguo:** a doc não fala de espaço **no meio** (`BEM VINDO10`), de outros
  caracteres de espaço (tab, espaço não separável) nem do que acontece com o campo vazio.
- **Interpretação adotada:** testei só o que a doc promete — maiúscula/minúscula e espaços nas
  pontas (`bemvindo10`, `BemVindo10`, `  BEMVINDO10  `). Não criei cenário pra espaço no meio
  nem pra cupom vazio, porque não há comportamento esperado documentado pra comparar.
- **Impacto se estiver errada:** falta cobertura, não há bug registrado. Dá pra virar um cenário
  assim que o PO definir o esperado.
- **Onde aparece:** CA02 em [`coupon.feature`](../tests/features/web/cart/coupon.feature).
- **Status:** ❓ Aguardando validação.

## AMB-06

**CA10 — limite de 5 unidades: por produto ou por pedido? E o que a tela faz?**

- **Trecho da documentação:** *"Cada produto pode ter no máximo 5 unidades por pedido. A regra
  vale para a interface e para a API."* e `QUANTIDADE_MAXIMA_EXCEDIDA`: *"A quantidade de um
  produto é maior que 5."*
- **Interpretação adotada:** o limite é **por produto** (5 camisetas + 5 bonés é permitido), e
  vale em **qualquer** caminho. Na tela o botão "+" trava em 5 (OK). Na API, 6 unidades deveria
  dar `422 QUANTIDADE_MAXIMA_EXCEDIDA` (BUG-02).
- **Onde aparece:** [`quantity-limit.feature`](../tests/features/web/cart/quantity-limit.feature) ·
  [`cart-rules.feature`](../tests/features/api/cart-rules.feature) ·
  [`bug-02`](../bugs/high/bug-02-quantity-limit-api.md).
- **Status:** ✅ A doc é clara; registrado pra deixar explícito "por produto".

## AMB-07

**Cupom inválido/expirado: por que é erro num endpoint e não no outro?**

- **Trecho da documentação:** `/api/carrinho/calcular`: *"Um cupom inválido ou expirado não gera
  erro aqui: a resposta é 200, sem desconto, e o motivo vem em cupom.mensagem."* /
  `/api/pedidos`: *"um cupom inválido ou expirado gera erro 422."*
- **Interpretação adotada:** é **intencional** (calcular só mostra o motivo; confirmar o pedido
  recusa). Não é inconsistência nem bug.
- **Onde aparece:** [`error-handling.feature`](../tests/features/api/error-handling.feature) ·
  evidências [`cupom-invalido-calcular.txt`](../evidence/api/cupom-invalido-calcular.txt) e
  [`cupom-expirado-pedido.txt`](../evidence/api/cupom-expirado-pedido.txt).
- **Status:** ✅ Sem ambiguidade.

## AMB-08

**O que a seção "Sobre este ambiente" cobre — e o que eu NÃO reportei como bug**

- **Trecho da documentação:** carrinho guardado só na aba; pedidos não são armazenados; sem
  e-mail nem cobrança; produtos, preços e cupons fixos; sem estoque; API sem estado.
- **Interpretação adotada:** tudo isso é **comportamento esperado**, não bug. Por exemplo, o
  BUG-02 cria um pedido com 6 unidades e recebe um número `VZ-…`; o número ser fictício e não
  existir consulta **não** é um problema separado.
- **Onde aparece:** [`environment-notes.feature`](../tests/features/web/environment/environment-notes.feature)
  (o cenário "Pedidos não são persistidos" é `@documentation`: não há como provar uma negativa).
- **Status:** ✅ Sem ambiguidade.
