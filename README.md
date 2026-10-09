# Teste técnico QA Júnior — Verzel Store

Teste da entrega **VZS-142** (cupom de desconto e frete grátis) da Verzel Store, ambiente de
teste técnico do processo seletivo de QA da Verzel.

- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação da entrega: https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- API: https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde está cada coisa

| Pedido no teste | Onde encontrar |
|---|---|
| Cenários de teste (Gherkin), um arquivo por funcionalidade | [`cenarios/`](cenarios/) |
| Execução dos testes manuais/exploratórios, com resultado de cada cenário | [`execucao/relatorio-execucao.md`](execucao/relatorio-execucao.md) |
| Bugs encontrados (organizados por severidade) | [`bugs/`](bugs/) |
| Prints da execução | [`evidencias/exploracao/`](evidencias/exploracao/) |
| Automação com Playwright | [`automation/`](automation/) |
| Cópia da documentação da entrega (só pra consulta offline) | [`docs/documentacao-entrega.txt`](docs/documentacao-entrega.txt) |
| Teste extra de acessibilidade (não pedido na vaga) | [`extra-acessibilidade/`](extra-acessibilidade/) |

## Bugs que encontrei (resumo)

1. **[High]** Frete grátis não é liberado quando o subtotal é exatamente R$ 200,00 (a documentação diz que esse valor deveria contar como frete grátis).
2. **[High]** A API aceita pedir mais de 5 unidades do mesmo produto, mesmo a documentação dizendo que o limite vale pra interface e pra API.
3. **[Low]** Quando falta o campo `produtoId` num item, a API devolve o código de erro errado.

Os bugs ficam separados em pastas por severidade (`bugs/High/`, `bugs/Medium/`, `bugs/Low/`).
Detalhes, passos pra reproduzir e prints de cada um estão em [`bugs/README.md`](bugs/README.md).

## Como rodar a automação

Precisa ter o [Node.js](https://nodejs.org/) instalado (usei a versão 20).

```bash
npm install
npx playwright install chromium
npm test
```

Os testes rodam direto contra o site da Verzel Store que já está no ar, não precisa subir nada local.

Outras formas de rodar:

```bash
# Modo com interface, pra ver os testes rodando
npm run test:ui

# Rodar só um arquivo
npx playwright test automation/tests/cupom.spec.js

# Abrir o relatório da última execução
npm run test:relatorio
```

### O que ficou automatizado

| Arquivo | O que cobre |
|---|---|
| `automation/tests/cupom.spec.js` | CA01 a CA05 — aplicar cupom, maiúscula/minúscula, cupom inválido/expirado, trocar de cupom |
| `automation/tests/frete.spec.js` | CA06 e CA07 — frete grátis acima de R$ 200 e frete fixo abaixo |
| `automation/tests/quantidade.spec.js` | CA10 — limite de 5 unidades na tela |
| `automation/tests/checkout.spec.js` | Validação dos dados do cliente e fluxo de compra do início ao fim |
| `automation/tests/api.spec.js` | Os códigos de erro que a documentação da API descreve |

Não automatizei os cenários que encontrei com bug (tipo o do frete em R$ 200,00 exato) — achei
melhor deixar eles só documentados no relatório de bugs, com o jeito de reproduzir, em vez de
deixar um teste quebrado de propósito dentro da suíte.

## Teste extra: acessibilidade

Isso aqui **não foi pedido no card** — o card só pedia pra deixar de fora teste de carga,
estresse e segurança (o ambiente é compartilhado com outros candidatos). Resolvi testar algo a
mais por conta própria, e acessibilidade pareceu uma boa escolha: não atrapalha ninguém no
ambiente compartilhado e também é parte do trabalho de QA.

Separei tudo isso (cenário, bugs, automação e relatório) numa pasta própria,
[`extra-acessibilidade/`](extra-acessibilidade/), pra não misturar com o que foi efetivamente
pedido na vaga. Essa automação também fica fora da suíte principal (não roda com `npm test`) —
tem um comando específico pra ela, explicado no README de lá.

## Sobre o uso de IA

Usei o Claude (Anthropic) pra me ajudar durante o teste todo: pra explorar a loja e a API de
forma automatizada (não tinha navegador disponível no ambiente, então usei o próprio Playwright
pra "clicar" nas coisas e ver o que acontecia), pra organizar os cenários em Gherkin, escrever o
relatório de execução e montar os testes automatizados. Conferi na mão cada resultado antes de
anotar um bug — rodando de novo, comparando com a documentação, etc. — pra não registrar nada
que não fosse de verdade um problema.
