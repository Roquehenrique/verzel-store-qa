# language: pt
# Produtos usados nos exemplos: P002 Calça Jeans Slim R$ 139,90 / P004 Boné Aba Curva R$ 49,90

@web
Funcionalidade: Arredondamento de valores

  @regression
  Cenário: CA11 - Valores de desconto são arredondados para 2 casas decimais
    Dado que tenho itens cujo subtotal é "R$ 239,70"
    Quando aplico o cupom "BEMVINDO10" (10%)
    Então o desconto exibido deve ser "- R$ 23,97"
    E todos os valores exibidos devem ter exatamente 2 casas decimais

    # Nota: todos os preços do catálogo terminam em ",90" ou ",00", e as quantidades são
    # limitadas a 5 por produto, então um desconto de 10% em qualquer subtotal alcançável nunca
    # chega a exigir arredondar uma terceira casa decimal diferente de zero. Não consegui montar
    # um caso de borda de verdade (ex: terminando em ",x5") com os dados fixos do catálogo -
    # documentado aqui como limitação conhecida, não como bug.
