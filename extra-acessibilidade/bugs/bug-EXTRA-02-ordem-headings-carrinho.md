# BUG-EXTRA-02 — Ordem de headings quebrada na página do carrinho (acessibilidade)

**Severidade:** Medium
**Como encontrei:** scanner automático de acessibilidade (axe-core), rodado via Playwright na página do carrinho.

### Como reproduzir
1. Adicione um produto ao carrinho e abra a página `/carrinho`.
2. Olhe a ordem dos headings (`h1`, `h2`, `h3`...) no HTML da página.

Dá pra ver isso direto no console do navegador também:
```js
Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => [h.tagName, h.textContent.trim()])
```

### O que encontrei
A ordem real dos headings na página do carrinho é:
```
H1  "Carrinho"
H3  "Camiseta Essencial"   <- pula direto de H1 pra H3, sem H2 no meio
H2  "Resumo do pedido"     <- H2 vem DEPOIS do H3
```

### Esperado
A ordem de headings deveria ser sequencial, sem pular nível (H1 → H2 → H3, não H1 → H3 → H2).
Pelo conteúdo da página, faria mais sentido o nome do produto ("Camiseta Essencial") ser um H2
dentro da lista de itens, no mesmo nível que "Resumo do pedido" — não um H3.

Isso é a mesma violação (`heading-order`) que o axe-core aponta:
```
[moderate] heading-order: Ensure the order of headings is semantically correct
target: ["h3"]
html: <h3>Camiseta Essencial</h3>
```
Regra: https://dequeuniversity.com/rules/axe/4.13/heading-order

### Por que isso importa
Quem usa leitor de tela costuma navegar pulando de heading em heading (tipo um "índice" da
página). Quando a ordem não é sequencial, essa navegação fica confusa — parece que falta
conteúdo entre o H1 e o H3, e o H2 que vem depois parece fora de lugar.

### Por que marquei como Medium
Não impede o uso do carrinho (o conteúdo continua acessível), mas atrapalha a navegação de
quem depende da estrutura de headings pra se localizar na página.
