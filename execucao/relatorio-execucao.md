# Relatório de execução dos testes — Entrega VZS-142

**Ambiente:** https://verzel-store.qa-test-verzel-store.workers.dev/
**Data da execução:** 08/10/2026

Fiz os testes de duas formas: manualmente pelo navegador (usando o Playwright pra controlar o
Chrome, já que esse ambiente de teste não tinha um navegador disponível pra eu abrir na mão) e
testando a API direto com `curl`, pra cobrir as regras de cálculo e os códigos de erro que a
documentação descreve.

As capturas de tela citadas abaixo estão em `evidencias/exploracao/`.

Legenda: ✅ Passou · ❌ Falhou · ⚠️ Observação (não é bug)

---

## Cupom de desconto

| Cenário | O que testei | Esperado | O que aconteceu | Status |
|---|---|---|---|---|
| CA01 — Cupom válido aplica 10% | Adicionei "Camiseta Essencial" (R$ 59,90) e apliquei `BEMVINDO10` | Desconto de R$ 5,99 (10% de 59,90) | Desconto mostrado: "Desconto (BEMVINDO10) - R$ 5,99", total R$ 73,81 | ✅ `08-cupom-minusculo-com-espacos.png` |
| CA02 — Cupom não liga pra maiúscula/minúscula e espaço | Apliquei `  bemvindo10  ` (minúsculo, com espaço antes e depois) | Deveria aplicar o cupom `BEMVINDO10` do mesmo jeito | Mensagem "Cupom BEMVINDO10 aplicado.", desconto de R$ 5,99 aplicado normal | ✅ `08-cupom-minusculo-com-espacos.png` |
| CA03 — Cupom que não existe | Apliquei `NAOEXISTE` | Mensagem "Cupom inválido.", sem desconto | Mensagem apareceu certinha; desconto ficou R$ 0,00 | ✅ `09-cupom-invalido.png` |
| CA04 — Cupom expirado | Apliquei `VERAO2026` (expirou em 31/03/2026) | Mensagem "Cupom expirado.", sem desconto | Mensagem apareceu certinha; desconto ficou R$ 0,00 | ✅ `10-cupom-expirado.png` |
| CA05 — Só um cupom por vez | Apliquei `BEMVINDO10` e olhei a tela do carrinho | Não deveria ter como digitar outro cupom sem antes remover o atual | Depois de aplicar, o campo de texto some e só sobra "Cupom BEMVINDO10 aplicado." + botão "Remover cupom" | ✅ `11-cupom-aplicado.png` |
| Cupom inválido/expirado na API de cálculo não quebra, só avisa | `POST /api/carrinho/calcular` com cupom `NAOEXISTE` | Deveria responder 200 normalmente, com o motivo dentro de `cupom.mensagem` | Respondeu 200; `cupom.aplicado: false`, mensagem "Cupom inválido." | ✅ |
| Cupom inválido/expirado na API de pedido dá erro de verdade | `POST /api/pedidos` com cupom inexistente e depois com cupom expirado | 422, com os códigos `CUPOM_INVALIDO` e `CUPOM_EXPIRADO` | Os dois casos deram certinho, exatamente como a documentação descreve | ✅ |

---

## Frete grátis

| Cenário | O que testei | Esperado | O que aconteceu | Status |
|---|---|---|---|---|
| CA06 — Frete grátis acima de R$ 200,00 | Carrinho com subtotal R$ 209,90 (Mochila + Camiseta + Garrafa) | `freteGratis: true`, frete R$ 0,00 | Deu frete grátis certinho | ✅ |
| CA06.1 — Frete grátis com subtotal EXATAMENTE R$ 200,00 | Carrinho com 2 Mochilas Urbanas (R$ 100,00 cada = R$ 200,00 certinho) | A documentação diz "inclusive", então deveria dar frete grátis também | Cobrou R$ 19,90 de frete mesmo assim. Testei 2 vezes pra ter certeza que não foi coisa pontual, e confirmei também pela tela (print) | ❌ **BUG-01** |
| CA07 — Frete fixo abaixo de R$ 200,00 + aviso de quanto falta | Carrinho com subtotal R$ 199,70 (Calça Jeans + 2 Kits de Meias) | Frete R$ 19,90 e mensagem "Faltam R$ 0,30 para o frete grátis." | Bateu certinho com o esperado | ✅ |
| CA08 — O cálculo do frete grátis usa o subtotal ANTES do desconto | Carrinho com subtotal R$ 239,70 (Calça Jeans + 2 Bonés) + cupom `BEMVINDO10` | Mesmo com 10% de desconto, o subtotal de R$ 239,70 (> 200) já garante frete grátis | `subtotal: 239.7`, `desconto: 23.97`, `frete: 0`, `total: 215.73` — confirma que a regra usa o valor cheio, não o valor já com desconto | ✅ |
| CA09 — O desconto não desconta do frete | Carrinho com subtotal R$ 59,90 (abaixo de R$ 200) + cupom `BEMVINDO10` | O frete continua R$ 19,90, sem desconto nenhum em cima dele | `frete: 19.9`, `total: 73.81` (= 59,90 − 5,99 + 19,90) — o frete não foi reduzido | ✅ |

---

## Limite de quantidade por produto

| Cenário | O que testei | Esperado | O que aconteceu | Status |
|---|---|---|---|---|
| CA10 — A tela não deixa passar de 5 unidades | Cliquei no "+" várias vezes em "Camiseta Essencial" até chegar em 5 | Botão "+" deveria travar em 5 e mostrar um aviso | O botão fica desabilitado a partir de 5 unidades, e aparece o texto "Limite de 5 unidades por produto." | ✅ `06-limite-5-unidades.png` |
| Teste exploratório — cliques bem rápidos no "+" | Com 2 produtos no carrinho, cliquei 4 vezes seguidas no "+" bem rápido, sem esperar a resposta de cada clique | Mesmo clicando rápido, o resultado final deveria estar certo | As respostas da API chegaram meio fora de ordem por causa da velocidade dos cliques, mas no final a tela mostrou o valor certo (quantidade travada em 5, subtotal R$ 999,00) — não vi nada errado pro usuário | ✅ `07-cliques-rapidos-quantidade.png` |
| CA10.1 — A API de cálculo deveria recusar quantidade acima de 5 | `POST /api/carrinho/calcular` com quantidade 6 (testei também com 100) | Deveria responder 422 `QUANTIDADE_MAXIMA_EXCEDIDA` | Respondeu 200 e calculou normal, sem nenhum erro | ❌ **BUG-02** |
| CA10.2 — A API de pedido deveria recusar quantidade acima de 5 | `POST /api/pedidos` com quantidade 6 e dados de cliente válidos | Deveria responder 422 `QUANTIDADE_MAXIMA_EXCEDIDA`, sem criar o pedido | Respondeu 201 e criou o pedido mesmo assim (`VZ-756695`) | ❌ **BUG-02** |

---

## Arredondamento (CA11)

| Cenário | O que testei | Esperado | O que aconteceu | Status |
|---|---|---|---|---|
| Desconto com 2 casas decimais | Subtotal R$ 239,70 + cupom de 10% | Desconto de R$ 23,97 (não algo tipo 23,970...) | `desconto: 23.97` | ✅ |
| Sobre o arredondamento em geral | — | — | Reparei que todos os preços do catálogo terminam em ,90 ou ,00. Tentei montar combinações que dessem um valor "feio" depois de calcular 10% (tipo terminando em ,x5, que obrigaria a arredondar pra cima ou pra baixo), mas com os produtos e quantidades disponíveis (máximo 5 por item) não consegui chegar nesse caso. Não é um bug, é só uma limitação dos dados fixos que a loja usa — deixo registrado aqui. | ⚠️ |

---

## Dados do cliente no checkout

| Cenário | O que testei | Esperado | O que aconteceu | Status |
|---|---|---|---|---|
| Nome sem sobrenome | No checkout, preenchi nome "Maria", e-mail e CEP válidos, e confirmei | Mensagem "Informe nome e sobrenome.", pedido não deveria ser criado | Mensagem apareceu do lado do campo, pedido não foi pra frente | ✅ `13-checkout-nome-invalido.png` |
| E-mail inválido (testado na API) | `POST /api/pedidos` com e-mail "maria-arroba-invalido" | 422 `DADOS_INVALIDOS`, apontando o campo `cliente.email` | Confirmado, com a mensagem "Informe um e-mail válido." | ✅ |
| CEP inválido (testado na API) | `POST /api/pedidos` com CEP "ABCDE-123" | 422 `DADOS_INVALIDOS`, apontando o campo `cliente.cep` | Confirmado, com a mensagem "Informe um CEP com 8 dígitos." | ✅ |
| CEP sem hífen também é aceito | `POST /api/pedidos` com CEP sem hífen | A documentação diz que aceita com ou sem hífen | Pedido foi criado normal (201); o CEP voltou salvo sem hífen | ✅ |
| Todos os dados do cliente faltando | `POST /api/pedidos` sem preencher o objeto `cliente` | Esperava pelo menos um erro | Voltaram os 3 erros de uma vez (nome, email e cep faltando) — achei legal que avisa tudo junto, em vez de um de cada vez | ✅ |
| Fluxo de compra completo | Adicionei 1 produto, fui pro checkout, preenchi nome completo + e-mail válido + CEP válido, confirmei | Deveria aparecer a tela "Pedido confirmado" com número `VZ-000000` e o carrinho deveria esvaziar | Apareceu "Pedido VZ-321735" e o contador do carrinho voltou a zero | ✅ `14-pedido-confirmado.png` |

---

## Códigos de erro da API

| Caso testado | Chamada | Esperado | Resultado | Status |
|---|---|---|---|---|
| JSON inválido | `POST /api/carrinho/calcular` com corpo `nao-e-json` | 400 `JSON_INVALIDO` | Deu certo | ✅ |
| Rota que não existe | `GET /api/rota-que-nao-existe` | 404 `ROTA_NAO_ENCONTRADA` | Deu certo | ✅ |
| Produto que não existe (consulta direta) | `GET /api/produtos/P999` | 404 `PRODUTO_NAO_ENCONTRADO` | Deu certo | ✅ |
| Método não permitido | `DELETE /api/produtos` | 405 `METODO_NAO_PERMITIDO` | Deu certo | ✅ |
| Lista de itens vazia | `POST /api/carrinho/calcular` com `itens: []` | 422 `ITENS_OBRIGATORIOS` | Deu certo | ✅ |
| `itens` não é uma lista (mandei texto) | `POST /api/carrinho/calcular` com `itens: "P001"` | Esperava algum erro de validação | Voltou 422 `ITENS_OBRIGATORIOS` — faz sentido, trata como se a lista estivesse faltando | ✅ |
| Item que não é um objeto | `POST /api/carrinho/calcular` com `itens: ["P001"]` | 422 `ITEM_INVALIDO` | Deu certo | ✅ |
| Item sem o campo `produtoId` | `POST /api/carrinho/calcular` com `{"quantidade":1}` | Eu esperava 422 `ITEM_INVALIDO` | Veio 422 `PRODUTO_NAO_ENCONTRADO` com a mensagem "Produto undefined não encontrado" | ❌ **BUG-03** |
| Produto que não existe dentro de um item | `POST /api/carrinho/calcular` com `produtoId: "P999"` | 422 `PRODUTO_NAO_ENCONTRADO` | Deu certo | ✅ |
| Produto duplicado na lista | `POST /api/carrinho/calcular` com `P001` duas vezes | 422 `ITEM_DUPLICADO` | Deu certo | ✅ |
| Quantidade 0 | `quantidade: 0` | 422 `QUANTIDADE_INVALIDA` | Deu certo | ✅ |
| Quantidade negativa | `quantidade: -1` | 422 `QUANTIDADE_INVALIDA` | Deu certo | ✅ |
| Quantidade decimal | `quantidade: 1.5` | 422 `QUANTIDADE_INVALIDA` | Deu certo | ✅ |
| Quantidade como texto | `quantidade: "2"` | Esperava 422 `QUANTIDADE_INVALIDA` (não deveria aceitar "2" como se fosse número 2) | Deu certo, recusou | ✅ |
| Item sem o campo `quantidade` | `{"produtoId":"P001"}` sem quantidade | 422 `QUANTIDADE_INVALIDA` | Deu certo | ✅ |

---

> Fiz também uma rodada extra de teste exploratório de acessibilidade, por conta própria (não
> fazia parte do que foi pedido no card). Pra não misturar com o escopo oficial da entrega,
> deixei o relatório dela separado em
> [`extra-acessibilidade/relatorio-execucao.md`](../extra-acessibilidade/relatorio-execucao.md).

---

## Coisas que reparei explorando, mas não são bugs

| Observação | O que vi | Status |
|---|---|---|
| Carrinho é por aba/navegador | Abrindo uma aba nova, outro navegador, ou uma janela anônima, o carrinho começa vazio mesmo já tendo adicionado produto em outro lugar | ⚠️ Não é bug — está escrito assim na seção "Sobre este ambiente" da documentação |
| Pedido não fica salvo em lugar nenhum | Não existe uma forma de consultar um pedido depois de criado | ⚠️ Não é bug — também está documentado |

---

## Resumo

- **Total de cenários testados:** 34
- **Passou:** 29
- **Falhou:** 3 (detalhes em `bugs/` — organizados por severidade em `High/`, `Medium/` e `Low/`)
- **Observações (não são bugs):** 2

Automatizei com Playwright os cenários principais que passaram (cupom, frete, limite de
quantidade e o fluxo de compra completo) — estão na pasta `automation/`. Os 3 bugs eu deixei só
documentados em `bugs/`, com os comandos `curl` prontos pra reproduzir, porque não fazia muito
sentido deixar um teste automatizado "quebrado" de propósito no meio da suíte.

(Números acima contam só o escopo pedido no card. O teste extra de acessibilidade que fiz por
conta própria tem a contagem dele à parte, em `extra-acessibilidade/relatorio-execucao.md`.)
