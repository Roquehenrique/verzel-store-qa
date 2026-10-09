# Teste extra: acessibilidade

Isso aqui **não foi pedido no card** da entrega VZS-142. O enunciado do teste técnico dizia pra
deixar de fora testes de carga, estresse e segurança, porque o ambiente é compartilhado com
outros candidatos. Resolvi testar algo a mais por conta própria, no lugar — acessibilidade
pareceu uma boa escolha: não atrapalha ninguém (não é carga nem estresse no servidor) e também
é parte do trabalho de QA.

Separei tudo isso numa pasta própria pra não misturar com as entregas que foram efetivamente
pedidas na vaga, que ficam em `tests/`, `bugs/` e `execution/` na raiz do projeto.

## O que testei

1. **Navegação só com teclado** — dá pra completar a compra inteira (adicionar produto →
   carrinho → aplicar cupom → ir pro checkout → preencher dados → confirmar pedido) usando só
   `Tab` e `Enter`, sem tocar no mouse? Resultado: sim, funciona 100%.
2. **Scanner automático de acessibilidade** — rodei o
   [axe-core](https://github.com/dequelabs/axe-core) (ferramenta padrão de mercado pra isso) nas
   páginas principais da loja (home, carrinho, checkout). Achei 2 problemas reais.

## O que encontrei

| ID | Título | Severidade | Arquivo |
|----|--------|-----------|---------|
| EXTRA-01 | Aviso do ambiente não está dentro de uma landmark | Medium | [`bugs/bug-extra-01-environment-banner-missing-landmark.md`](bugs/bug-extra-01-environment-banner-missing-landmark.md) |
| EXTRA-02 | Ordem de headings quebrada no carrinho | Medium | [`bugs/bug-extra-02-heading-order-cart-page.md`](bugs/bug-extra-02-heading-order-cart-page.md) |

Detalhes completos da execução (o que passou, o que não passou) em
[`execution-report.md`](execution-report.md). Cenários em Gherkin em
[`tests/features/accessibility.feature`](tests/features/accessibility.feature) — assim como no
restante do projeto, esse `.feature` **é** o teste automatizado (via `playwright-bdd`), não só
documentação ao lado de um teste separado.

## Onde está cada coisa

```
extra-accessibility/
├── README.md                  (esse arquivo)
├── execution-report.md        (resultado de cada cenário)
├── bugs/                      (os 2 bugs encontrados)
└── tests/
    ├── features/
    │   └── accessibility.feature     (cenários em Gherkin, em português, tags @web @accessibility)
    ├── step-definitions/
    │   └── accessibility.steps.js    (implementação de cada passo)
    └── playwright.config.js          (config própria, separada da suíte principal)
```

Os cenários tagueados `@known-bug` (os 2 bugs de acessibilidade) ficam no `.feature` como
documentação, mas são excluídos da geração/execução — mesma convenção usada na raiz do
projeto.

## Como rodar

Essa automação **não roda junto com o `npm test` da raiz do projeto** — de propósito, pra não
misturar com os testes do escopo oficial. Ela usa a mesma instalação de dependências da raiz
(`@axe-core/playwright` e `playwright-bdd` já estão listados no `package.json` principal), só
que com uma config própria:

```bash
# na raiz do projeto, depois do npm install / playwright install de sempre
npm run test:extra:accessibility

# ver o relatório HTML da última execução
npm run test:extra:accessibility:report
```
