# Evidências

Regra adotada: **todo bug e todo cenário executado tem evidência verificável** — e a evidência
é o dado bruto (print ou request/response completo), não só uma transcrição minha.

```
evidence/
├── exploration/   prints da exploração manual pela interface (UI)
└── api/           request + response CRUS (status, headers, corpo) das chamadas de API
```

- As evidências de API são geradas por [`scripts/capture-api-evidence.sh`](../scripts/capture-api-evidence.sh)
  (`bash scripts/capture-api-evidence.sh`). Cada arquivo tem data/hora (UTC), ambiente, o request
  enviado e o `curl -i` completo. Rodar de novo regera tudo.
- Os cenários de API da suíte automatizada **anexam request e response ao relatório HTML**
  (`npm run test:report` → aba "Attachments" de cada teste), então cada execução da suíte também
  produz a própria evidência.
- Interpretações da documentação que sustentam algum desses resultados: [`docs/ambiguidades.md`](../docs/ambiguidades.md).

## Rastreabilidade: bug → evidência

| Bug | Evidência de UI | Evidência de API (bruta) | Controle (mostra o que funciona) |
|---|---|---|---|
| BUG-01 | `exploration/15-bug-free-shipping-200.png` | `api/bug-01-subtotal-200.txt` | `api/bug-01-controle-subtotal-199-70.txt`, `api/bug-01-controle-subtotal-209-90.txt` |
| BUG-02 | `exploration/06-quantity-limit.png` (tela trava em 5) | `api/bug-02-calcular-quantidade-6.txt`, `api/bug-02-pedido-quantidade-6.txt` | — |
| BUG-03 | — (só existe na API) | `api/bug-03-item-sem-produtoid.txt` | `api/bug-03-controle-item-nao-objeto.txt` |
| EXTRA-01 / EXTRA-02 | saída do axe-core nos relatos em `extra-accessibility/bugs/` | — | — |

## Rastreabilidade: cenário → evidência

| Cenário | Evidência |
|---|---|
| CA01 cupom válido | `exploration/08-coupon-lowercase-with-spaces.png`, `exploration/11-coupon-applied.png` |
| CA02 maiúscula/minúscula e espaços | `exploration/08-coupon-lowercase-with-spaces.png` |
| CA03 cupom inexistente | `exploration/09-invalid-coupon.png` |
| CA04 cupom expirado | `exploration/10-expired-coupon.png` |
| CA05 / CA05.1 um cupom por vez | `exploration/11-coupon-applied.png` |
| CA06.1 subtotal exatamente R$ 200,00 | `exploration/15-bug-free-shipping-200.png`, `api/bug-01-subtotal-200.txt` |
| CA06 / CA07 frete | `api/bug-01-controle-subtotal-209-90.txt`, `api/bug-01-controle-subtotal-199-70.txt` |
| CA08 / CA09 / CA11 | Relatório de execução (valores da API) — **sem print** (lacuna conhecida, ver abaixo) |
| CA10 limite na tela | `exploration/06-quantity-limit.png`, `exploration/07-rapid-quantity-clicks.png` |
| CA10.1 / CA10.2 limite na API | `api/bug-02-calcular-quantidade-6.txt`, `api/bug-02-pedido-quantidade-6.txt` |
| Cupom inválido: calcular x pedido | `api/cupom-invalido-calcular.txt`, `api/cupom-expirado-pedido.txt` |
| Checkout (formulário, nome inválido, pedido confirmado) | `exploration/12-…`, `13-…`, `14-order-confirmed.png` |
| Códigos de erro da API (demais) | Anexos do relatório HTML da suíte (`npm run test:report`) |

## Lacunas conhecidas

Dizer onde falta evidência é melhor do que fingir que está tudo coberto:

- **CA08, CA09, CA11 (UI):** validados e registrados em valores da API, mas **sem print** da tela.
- **Validação de e-mail e CEP no checkout:** só o nome inválido tem print (`13-…`).
- **Carrinho isolado por aba:** sem print.
- **Prints numerados 04, 05:** não existem (a numeração saltou); a sequência não foi renumerada
  pra não quebrar as referências do relatório de execução.
- **Vídeo:** não há. O Playwright está configurado pra guardar trace e screenshot **só em
  falha**; cenários que passam não geram evidência automática.
