# language: pt

@web
Funcionalidade: Particularidades do ambiente de teste (não são bugs)
  # Isso aqui é só pra registrar - está descrito na seção "Sobre este ambiente" da
  # documentação, então não é pra reportar como bug.

  @regression
  Cenário: Carrinho é isolado por aba/navegador
    Dado que adicionei produtos ao carrinho em uma aba
    Quando abro a loja em uma nova aba, outro navegador ou janela anônima
    Então o carrinho da nova sessão deve iniciar vazio

  @documentation
  Cenário: Pedidos não são persistidos
    Dado que confirmei um pedido e recebi um número "VZ-000000"
    Quando tento consultar esse pedido posteriormente
    Então não deve existir nenhuma funcionalidade de consulta de pedidos
    # Não executado como verificação automática - não tem o que clicar pra provar uma
    # negativa aqui. Só documentando o comportamento esperado, pra rastreabilidade.
