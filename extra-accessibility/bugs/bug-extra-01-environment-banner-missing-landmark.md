# BUG-EXTRA-01 — Aviso do ambiente de teste não está dentro de uma landmark (acessibilidade)

**Severidade:** Medium
**Como encontrei:** scanner automático de acessibilidade ([axe-core](https://github.com/dequelabs/axe-core)), rodado via Playwright nas páginas principais da loja.

A faixa de aviso que aparece no topo de toda página ("Ambiente de teste técnico do processo
seletivo de QA da Verzel. Leia a documentação antes de começar.") não está dentro de nenhuma
landmark HTML (`<header>`, `<main>`, `<nav>`, `<footer>`, etc.) — ela fica solta direto dentro
do `<div id="root">`.

Isso é um problema de acessibilidade: quem navega com leitor de tela normalmente usa as
landmarks pra pular entre as seções da página (ex: "pular pro conteúdo principal"). Conteúdo
fora de qualquer landmark fica sem uma categoria clara e pode ser mais difícil de encontrar ou
ser ignorado por essa navegação.

### Como reproduzir
Rodar o axe-core em qualquer página da loja (home, carrinho, checkout, pedido confirmado) — o
mesmo elemento (`.aviso-ambiente`) aparece como violação nas 4 páginas, porque é um componente
compartilhado pelo layout.

```js
const { AxeBuilder } = require('@axe-core/playwright');
const results = await new AxeBuilder({ page }).analyze();
```

### O que o axe-core reporta
```
[moderate] region: Ensure all page content is contained by landmarks
target: [".aviso-ambiente"]
html: <div class="aviso-ambiente" role="note"><p>Ambiente de teste técnico do processo seletivo de QA da Verzel...</p></div>
```
Regra: https://dequeuniversity.com/rules/axe/4.13/region

### Esperado
O aviso poderia ficar dentro do `<header>` da página, ou envolvido por uma landmark própria
(ex: `<aside role="note">` já teria um papel, mas teria que estar dentro da estrutura de
landmarks da página, não solto fora dela).

### Por que marquei como Medium
Não impede ninguém de usar o site (o conteúdo ainda é lido, só que fora de uma landmark), mas é
uma violação real de acessibilidade (WCAG) que se repete em todas as páginas por ser parte do
layout compartilhado — por isso não é "Low", mas também não trava nenhum fluxo, então não é
"High".
