# language: pt
# Produtos usados nos exemplos:
#   P001 Camiseta Essencial   R$ 59,90
#   P004 Boné Aba Curva       R$ 49,90
#   P005 Mochila Urbana 20L   R$ 100,00
#   P008 Garrafa Térmica      R$ 50,00

@web
Funcionalidade: Frete grátis
  Para pagar menos nas minhas compras
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras maiores

  @regression
  Cenário: CA06 - Frete grátis para subtotal acima de R$ 200,00
    Dado que tenho itens no carrinho cujo subtotal é "R$ 209,90"
    Então o frete deve ser "Grátis"

  @known-bug
  Cenário: CA06.1 (fronteira) - Frete grátis para subtotal exatamente igual a R$ 200,00
    Dado que tenho itens no carrinho cujo subtotal é exatamente "R$ 200,00"
    Então o frete deve ser "Grátis"
    # A documentação diz "a partir de R$ 200,00, inclusive", então esse valor exato
    # deveria dar frete grátis. Achei um bug aqui - ver bugs/High/bug-01-frete-gratis-subtotal-200.md

  @regression
  Cenário: CA07 - Frete fixo abaixo de R$ 200,00 e mensagem de valor faltante
    Dado que tenho itens no carrinho cujo subtotal é "R$ 199,70"
    Então o frete deve ser "R$ 19,90"
    E a mensagem "Faltam R$ 0,30 para o frete grátis." deve ser exibida

  @regression
  Cenário: CA08 - Regra de frete grátis considera o subtotal antes do desconto do cupom
    Dado que tenho itens no carrinho cujo subtotal é "R$ 209,90"
    Quando aplico um cupom válido de 10%
    Então o frete deve continuar "Grátis"
    # O desconto reduziria o total pago, mas não deve "tirar" o cliente do frete grátis
    # nem o contrário: a base de cálculo do frete é sempre o subtotal cheio.

  @regression
  Cenário: CA09 - O desconto do cupom não incide sobre o valor do frete
    Dado que tenho itens no carrinho cujo subtotal é "R$ 59,90" (abaixo de R$ 200,00)
    Quando aplico o cupom "BEMVINDO10"
    Então o frete cobrado deve continuar "R$ 19,90" (sem desconto aplicado sobre ele)
    E o total deve ser "R$ 73,81" (59,90 - 5,99 + 19,90)
