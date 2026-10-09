# language: pt
# Produtos usados nos exemplos: P002 Calça Jeans Slim R$ 139,90 / P004 Boné Aba Curva R$ 49,90

Funcionalidade: Arredondamento de valores

  Cenário: CA11 - Valores de desconto são arredondados para 2 casas decimais
    Dado que tenho itens cujo subtotal é "R$ 239,70"
    Quando aplico o cupom "BEMVINDO10" (10%)
    Então o desconto exibido deve ser "R$ 23,97"
    E todos os valores exibidos devem ter exatamente 2 casas decimais
