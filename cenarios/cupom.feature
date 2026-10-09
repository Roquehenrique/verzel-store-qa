# language: pt
# Produto usado nos exemplos: P001 Camiseta Essencial R$ 59,90
# Cupons: BEMVINDO10 (10%, válido) / VERAO2026 (15%, expirado em 31/03/2026)

Funcionalidade: Cupom de desconto no carrinho
  Para pagar menos nas minhas compras
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto no carrinho

  Cenário: CA01 - Aplicar cupom válido concede 10% de desconto sobre o subtotal
    Dado que tenho a "Camiseta Essencial" (R$ 59,90) no carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto exibido deve ser "R$ 5,99"
    E a mensagem "Cupom BEMVINDO10 aplicado." deve ser exibida

  Esquema do Cenário: CA02 - Código do cupom não diferencia maiúsculas/minúsculas e ignora espaços
    Dado que tenho a "Camiseta Essencial" (R$ 59,90) no carrinho
    Quando aplico o cupom "<cupom_digitado>"
    Então o cupom "BEMVINDO10" deve ser aplicado com sucesso

    Exemplos:
      | cupom_digitado  |
      | bemvindo10      |
      | BemVindo10      |
      |   BEMVINDO10    |
      | bemvindo10      |

  Cenário: CA03 - Cupom inexistente não aplica desconto e exibe mensagem específica
    Dado que tenho a "Camiseta Essencial" (R$ 59,90) no carrinho
    Quando aplico o cupom "NAOEXISTE"
    Então a mensagem "Cupom inválido." deve ser exibida
    E o desconto exibido deve ser "R$ 0,00"

  Cenário: CA04 - Cupom fora da validade não aplica desconto e exibe mensagem específica
    Dado que tenho a "Camiseta Essencial" (R$ 59,90) no carrinho
    Quando aplico o cupom "VERAO2026"
    Então a mensagem "Cupom expirado." deve ser exibida
    E o desconto exibido deve ser "R$ 0,00"

  Cenário: CA05 - Apenas um cupom pode estar ativo por vez
    Dado que tenho a "Camiseta Essencial" (R$ 59,90) no carrinho
    E apliquei o cupom "BEMVINDO10" com sucesso
    Quando visualizo o carrinho
    Então não deve haver campo para digitar um novo cupom
    E deve haver apenas a opção "Remover cupom"

  Cenário: CA05.1 - Remover cupom permite aplicar outro em seguida
    Dado que tenho a "Camiseta Essencial" (R$ 59,90) no carrinho
    E apliquei o cupom "BEMVINDO10" com sucesso
    Quando removo o cupom atual
    E aplico o cupom "NAOEXISTE"
    Então a mensagem "Cupom inválido." deve ser exibida
