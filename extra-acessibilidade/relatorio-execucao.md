# Relatório de execução — teste extra de acessibilidade

**Ambiente:** https://verzel-store.qa-test-verzel-store.workers.dev/
**Data da execução:** 09/10/2026

Isso aqui não fazia parte do escopo pedido no card (ver [`README.md`](README.md) dessa pasta
pra entender o porquê de ter feito mesmo assim). Testei de duas formas: navegação manual só com
teclado (via Playwright, controlando o Chrome) e um scanner automático de acessibilidade
(axe-core) nas páginas principais.

Legenda: ✅ Passou · ❌ Falhou

| Cenário | O que testei | Esperado | O que aconteceu | Status |
|---|---|---|---|---|
| Comprar usando só o teclado | Naveguei o fluxo inteiro (home → adicionar produto → carrinho → finalizar → preencher checkout → confirmar) só com Tab e Enter, sem tocar no mouse | Devia dar pra completar a compra inteira só com teclado | Consegui concluir o pedido inteiro sem mouse. Todo botão/link/campo importante é alcançável com Tab, em uma ordem que faz sentido | ✅ |
| Indicador de foco visível | Fui apertando Tab em várias páginas e reparando se dava pra ver onde o foco estava | Elemento focado deveria ter algum contorno visível | Todo elemento focado mostra um contorno (outline) de 2px — não achei nenhum lugar com `outline: none` sem substituto | ✅ |
| Scanner automático (axe-core) na home | Rodei o axe-core na página inicial | Não deveria ter violação grave (`critical`/`serious`) | Só achou 1 violação `moderate` (ver abaixo) | ✅ (sem violação grave) |
| Scanner automático (axe-core) no carrinho | Rodei o axe-core no carrinho com 1 produto | Não deveria ter violação grave | Achou 2 violações `moderate` (ver abaixo) | ✅ (sem violação grave) |
| Scanner automático (axe-core) no checkout | Rodei o axe-core na tela de checkout | Não deveria ter violação grave | Só achou 1 violação `moderate` (ver abaixo) | ✅ (sem violação grave) |
| Aviso do ambiente fora de uma landmark | O axe apontou isso nas 4 páginas testadas (home, carrinho, checkout, pedido confirmado) | — | Violação real de acessibilidade, documentada | ❌ **EXTRA-01** |
| Ordem de headings quebrada no carrinho | O axe apontou isso no carrinho | Headings deveriam seguir ordem sequencial (h1 → h2 → h3) | A ordem real é H1 → H3 → H2 | ❌ **EXTRA-02** |

## Resumo

- **Total de cenários testados:** 7
- **Passou:** 5
- **Falhou:** 2 (detalhes em [`bugs/`](bugs/))

Os testes de navegação por teclado e o scanner automático estão automatizados em
`automation/acessibilidade.spec.js` (roda com `npm run test:extra:acessibilidade`, não com o
`npm test` principal). Os scans só falham se aparecer violação `critical` ou `serious` — as
`moderate` que encontrei ficaram documentadas como bugs em `bugs/`, não deixei travando a
suíte porque não impedem ninguém de usar o site.
