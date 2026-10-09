# Teste extra: acessibilidade

Isso aqui **não foi pedido no card** da entrega VZS-142. O enunciado do teste técnico dizia pra
deixar de fora testes de carga, estresse e segurança, porque o ambiente é compartilhado com
outros candidatos. Resolvi testar algo a mais por conta própria, no lugar — acessibilidade
pareceu uma boa escolha: não atrapalha ninguém (não é carga nem estresse no servidor) e também
é parte do trabalho de QA.

Separei tudo isso numa pasta própria pra não misturar com as entregas que foram efetivamente
pedidas na vaga, que ficam em `cenarios/`, `bugs/`, `execucao/` e `automation/` na raiz do
projeto.

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
| EXTRA-01 | Aviso do ambiente não está dentro de uma landmark | Medium | [`bugs/bug-EXTRA-01-aviso-ambiente-sem-landmark.md`](bugs/bug-EXTRA-01-aviso-ambiente-sem-landmark.md) |
| EXTRA-02 | Ordem de headings quebrada no carrinho | Medium | [`bugs/bug-EXTRA-02-ordem-headings-carrinho.md`](bugs/bug-EXTRA-02-ordem-headings-carrinho.md) |

Detalhes completos da execução (o que passou, o que não passou) em
[`relatorio-execucao.md`](relatorio-execucao.md). Cenários em Gherkin em
[`acessibilidade.feature`](acessibilidade.feature).

## Onde está cada coisa

```
extra-acessibilidade/
├── README.md                  (esse arquivo)
├── acessibilidade.feature     (cenários em Gherkin)
├── relatorio-execucao.md      (resultado de cada cenário)
├── bugs/                      (os 2 bugs encontrados)
└── automation/
    ├── playwright.config.js   (config própria, separada da suíte principal)
    └── acessibilidade.spec.js (testes automatizados)
```

## Como rodar

Essa automação **não roda junto com o `npm test` da raiz do projeto** — de propósito, pra não
misturar com os testes do escopo oficial. Ela usa a mesma instalação de dependências da raiz
(o `@axe-core/playwright` já está listado no `package.json` principal), só que com uma config
própria:

```bash
# na raiz do projeto, depois do npm install / playwright install de sempre
npm run test:extra:acessibilidade

# ver o relatório HTML da última execução
npm run test:extra:acessibilidade:relatorio
```
