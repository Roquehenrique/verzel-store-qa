# Teste técnico QA Júnior — Verzel Store

Teste da entrega **VZS-142** (cupom de desconto e frete grátis) da Verzel Store, ambiente de
teste técnico do processo seletivo de QA da Verzel.

- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação da entrega: https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- API: https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde está cada coisa

| Pedido no teste | Onde encontrar |
|---|---|
| Cenários de teste (Gherkin/BDD) | [`tests/features/`](tests/features/) |
| Automação (os cenários acima são os próprios testes executados) | [`tests/step-definitions/`](tests/step-definitions/) + [`tests/support/`](tests/support/) |
| Execução dos testes manuais/exploratórios, com resultado de cada cenário | [`execution/execution-report.md`](execution/execution-report.md) |
| Bugs encontrados (organizados por severidade) | [`bugs/`](bugs/) |
| Prints da execução | [`evidence/exploration/`](evidence/exploration/) |
| Cópia da documentação da entrega (só pra consulta offline) | [`docs/delivery-documentation.txt`](docs/delivery-documentation.txt) |
| Teste extra de acessibilidade (não pedido na vaga) | [`extra-accessibility/`](extra-accessibility/) |

## Bugs que encontrei (resumo)

1. **[High]** Frete grátis não é liberado quando o subtotal é exatamente R$ 200,00 (a documentação diz que esse valor deveria contar como frete grátis).
2. **[High]** A API aceita pedir mais de 5 unidades do mesmo produto, mesmo a documentação dizendo que o limite vale pra interface e pra API.
3. **[Low]** Quando falta o campo `produtoId` num item, a API devolve o código de erro errado.

Os bugs ficam separados em pastas por severidade (`bugs/high/`, `bugs/medium/`, `bugs/low/`).
Detalhes, passos pra reproduzir e prints de cada um estão em [`bugs/README.md`](bugs/README.md).

## Como está organizado o projeto

Os cenários em Gherkin **são** os testes automatizados — não é um documento à parte que
descreve o que o código faz, é o próprio BDD rodando de verdade contra a loja, via
[`playwright-bdd`](https://github.com/vitalets/playwright-bdd) (que gera testes do Playwright a
partir dos arquivos `.feature` + os "step definitions" que implementam cada frase).

```
tests/
├── features/                  # o QUÊ é testado, em Gherkin (linguagem de negócio, em português)
│   ├── web/
│   │   ├── cart/               (coupon, shipping, quantity-limit, rounding)
│   │   ├── checkout/
│   │   └── environment/
│   └── api/                    (error-handling, cart-rules)
├── step-definitions/           # o COMO: traduz cada frase do Gherkin em chamadas aos Page Objects
│   ├── web/                    (cart.steps.js, checkout.steps.js, environment.steps.js)
│   └── api/                    (error-handling.steps.js)
└── support/
    ├── catalog.js               (catálogo de produtos: nome, índice na lista, preço)
    ├── actions.js               (fluxos que passam por mais de uma página, ex: montar um
    │                             carrinho com um subtotal específico)
    └── pages/                   # Page Objects: só aqui existe seletor de HTML
        ├── home-page.js
        ├── cart-page.js
        ├── checkout-page.js
        └── order-confirmed-page.js
```

Os nomes de arquivos e pastas seguem o padrão em inglês comum em projetos de BDD/Cucumber
(`coupon.feature`, `cart.steps.js`...), mas o conteúdo dos cenários — a linguagem de negócio em
si — fica em português, já que é nisso que o avaliador vai reparar primeiro.

A organização segue a mesma ideia de clean architecture, em 3 camadas:

1. **`features/`** (especificação) — não sabe nada sobre HTML, URL ou seletor.
2. **`step-definitions/`** (adaptação) — traduz cada frase do Gherkin numa chamada a um Page
   Object ou a um fluxo de `actions.js`. Não guarda seletor nenhum.
3. **`support/pages/`** (implementação) — único lugar que conhece a estrutura real da página
   (`[data-valor="desconto"]`, `#campo-nome`, etc). Se um seletor mudar no site, só se mexe
   aqui — o cenário e o step continuam exatamente iguais.

Trocar como a loja é testada (por exemplo, apontar pra outro ambiente, ou mudar um seletor que
quebrou) nunca deveria exigir reescrever o cenário de negócio.

### Tags

Cada cenário tem pelo menos uma tag de **tipo de aplicação** testada — hoje só existe loja web e
API, então uso `@web` e `@api` (se um dia existisse app mobile, entrariam `@android`/`@ios` do
mesmo jeito). Também uso:

- `@regression` — cenário que descreve um comportamento que já funciona hoje.
- `@known-bug` — cenário que descreve o comportamento **correto** esperado pela documentação,
  mas que hoje falha por causa de um bug confirmado (ver `bugs/`). Roda **de propósito** junto
  com o resto da suíte, como teste de regressão do bug: enquanto o bug existir, `npm test`
  mostra esses 3 cenários como falha — isso é esperado, não é a suíte quebrada. Quando o bug for
  corrigido, o teste passa a passar sozinho, sem precisar mexer em nada.
- `@documentation` — um cenário que é só uma nota (ex: "pedidos não são persistidos"), sem uma
  forma sensata de automatizar uma prova de negativa. Esse sim fica fora da execução
  (configurado em `playwright.config.js`), já que não há o que rodar.

Cada cenário também tem uma tag de **prioridade de execução** — útil pra rodar só o essencial
quando o tempo é curto (ex: só `@critical` antes de um deploy):

- `@critical` — regra de negócio com impacto financeiro direto (cálculo de frete, desconto) ou
  o fluxo de compra ponta a ponta. Se isso quebrar, a loja vende errado.
- `@high` — regras importantes mas secundárias (ordem de cálculo, validação de dados do
  cliente, contrato de erro da API).
- `@medium` — variações e casos de borda das regras principais (maiúscula/minúscula do cupom,
  formato do CEP, etc.).
- `@low` — detalhes com pouco impacto prático (arredondamento, consulta simples, particularidade
  do ambiente).

```bash
# Rodar só os cenários críticos
npx bddgen && npx playwright test --grep @critical
```

## Como rodar a automação

Precisa ter o [Node.js](https://nodejs.org/) instalado (usei a versão 20).

```bash
npm install
npx playwright install chromium
npm test
```

`npm test` primeiro gera os testes do Playwright a partir dos `.feature` (`bddgen`) e depois
roda tudo. Os testes rodam direto contra o site da Verzel Store que já está no ar, não precisa
subir nada local.

> **`npm test` vai terminar com 3 testes falhando — isso é esperado.** São os cenários
> `@known-bug` (ver seção de Tags abaixo): eles descrevem o comportamento correto esperado pela
> documentação e falham porque a Verzel Store tem 3 bugs confirmados nesse momento (ver
> `bugs/`). Não é a suíte quebrada — é a suíte sinalizando bug de verdade. Resultado esperado:
> **37 passam, 3 falham** (40 no total).

Outras formas de rodar:

```bash
# Modo com interface, pra ver os testes rodando
npm run test:ui

# Rodar só uma feature específica
npx bddgen && npx playwright test tests/features/web/cart/coupon.feature

# Rodar só os cenários de uma tag (ex: só os de API)
npx bddgen && npx playwright test --grep @api

# Abrir o relatório da última execução
npm run test:report
```

O relatório HTML é gerado em `tests/html-report/` (e `extra-accessibility/tests/html-report/`
pra suíte extra). Essas pastas não são commitadas (estão no `.gitignore`) — são recriadas toda
vez que os testes rodam.

### O que ficou automatizado

| Feature | O que cobre |
|---|---|
| `tests/features/web/cart/coupon.feature` | CA01 a CA05.1 — aplicar cupom, maiúscula/minúscula, cupom inválido/expirado, trocar de cupom |
| `tests/features/web/cart/shipping.feature` | CA06 a CA09 — frete grátis acima de R$ 200 e frete fixo abaixo (CA06.1 é teste de regressão do BUG-01, falha até o bug ser corrigido) |
| `tests/features/web/cart/quantity-limit.feature` | CA10 — limite de 5 unidades na tela |
| `tests/features/web/cart/rounding.feature` | CA11 — arredondamento de valores |
| `tests/features/web/checkout/checkout.feature` | Validação dos dados do cliente e fluxo de compra do início ao fim |
| `tests/features/web/environment/environment-notes.feature` | Particularidades do ambiente (carrinho isolado por aba) |
| `tests/features/api/error-handling.feature` | Todos os códigos de erro que a documentação da API descreve |
| `tests/features/api/cart-rules.feature` | CA10.1/CA10.2 — teste de regressão do BUG-02, falha até o bug ser corrigido |

## Teste extra: acessibilidade

Isso aqui **não foi pedido no card** — o card só pedia pra deixar de fora teste de carga,
estresse e segurança (o ambiente é compartilhado com outros candidatos). Resolvi testar algo a
mais por conta própria, e acessibilidade pareceu uma boa escolha: não atrapalha ninguém no
ambiente compartilhado e também é parte do trabalho de QA.

Separei tudo isso (cenário, bugs, automação e relatório) numa pasta própria,
[`extra-accessibility/`](extra-accessibility/), com a mesma organização BDD daqui, pra não
misturar com o que foi efetivamente pedido na vaga. Essa automação também fica fora da suíte
principal (não roda com `npm test`) — tem um comando específico pra ela, explicado no README de
lá.

## Sobre o uso de IA

Usei o Claude (Anthropic) pra me ajudar durante o teste todo: pra explorar a loja e a API de
forma automatizada (não tinha navegador disponível no ambiente, então usei o próprio Playwright
pra "clicar" nas coisas e ver o que acontecia), pra organizar os cenários em Gherkin, escrever o
relatório de execução e montar a automação (incluindo migrar pra um setup de BDD de verdade com
`playwright-bdd`, depois de já ter uma primeira versão só com Playwright). Conferi na mão cada
resultado antes de anotar um bug — rodando de novo, comparando com a documentação, etc. — pra
não registrar nada que não fosse de verdade um problema.
