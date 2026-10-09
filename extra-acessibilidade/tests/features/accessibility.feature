# language: pt
# Cenários do teste extra de acessibilidade - ver extra-acessibilidade/README.md pra entender
# o porquê disso existir.

@web @accessibility
Funcionalidade: Acessibilidade

  @regression
  Cenário: É possível comprar do início ao fim usando só o teclado
    Dado que estou na página inicial
    Quando navego até o botão "Adicionar ao carrinho" só com Tab e ativo com Enter
    E vou pro carrinho e navego até "Finalizar compra" só com Tab e ativo com Enter
    E preencho nome, e-mail e CEP só com teclado e confirmo o pedido
    Então devo chegar na tela de pedido confirmado sem ter usado o mouse

  @regression
  Cenário: Elementos focáveis têm um indicador visual de foco
    Dado que estou em qualquer página da loja
    Quando navego pelos elementos com Tab
    Então cada elemento focado deve ter um contorno (outline) visível

  @regression
  Cenário: A home não deve ter violações graves de acessibilidade
    Quando escaneio a página inicial com o axe-core
    Então não deve haver violações do tipo "critical" ou "serious"

  @regression
  Cenário: O carrinho não deve ter violações graves de acessibilidade
    Dado que tenho um produto no carrinho
    Quando escaneio a página do carrinho com o axe-core
    Então não deve haver violações do tipo "critical" ou "serious"

  @regression
  Cenário: O checkout não deve ter violações graves de acessibilidade
    Dado que tenho um produto no carrinho e estou na página de checkout
    Quando escaneio a página com o axe-core
    Então não deve haver violações do tipo "critical" ou "serious"

  @known-bug
  Cenário: Aviso do ambiente de teste deveria estar dentro de uma landmark
    Quando escaneio qualquer página da loja com o axe-core
    Então não deve haver violação do tipo "region" no elemento ".aviso-ambiente"
    # Na prática o axe-core aponta essa violação (moderate) em todas as páginas.
    # Ver bugs/bug-EXTRA-01-aviso-ambiente-sem-landmark.md

  @known-bug
  Cenário: Ordem de headings quebrada na página do carrinho
    Dado que tenho um produto no carrinho
    Quando olho a ordem dos headings (h1, h2, h3...) da página
    Então a ordem deveria ser sequencial, sem pular nível
    # Na prática a ordem é H1 > H3 > H2 - ver bugs/bug-EXTRA-02-ordem-headings-carrinho.md
