#!/usr/bin/env bash
# Captura request + response CRUA (status, headers e corpo, via curl -i) das chamadas de API
# citadas nos bugs e salva em evidence/api/. Rodar de novo regera as evidências com data/hora.
#
# Uso: bash scripts/capture-api-evidence.sh
set -u

BASE="${BASE_URL:-https://verzel-store.qa-test-verzel-store.workers.dev}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/evidence/api"
mkdir -p "$OUT"

# capture <arquivo> <metodo> <rota> [corpo-json]
capture() {
  local file="$1" method="$2" route="$3" body="${4:-}"
  {
    echo "# Capturado em: $(date -u '+%Y-%m-%dT%H:%M:%SZ') (UTC)"
    echo "# Ambiente: $BASE"
    echo "# --- REQUEST ---"
    if [ -n "$body" ]; then
      echo "$method $route"
      echo "Content-Type: application/json"
      echo "$body"
    else
      echo "$method $route"
    fi
    echo
    echo "# --- RESPONSE (curl -i) ---"
    if [ -n "$body" ]; then
      curl -s -i -X "$method" "$BASE$route" -H "Content-Type: application/json" -d "$body"
    else
      curl -s -i -X "$method" "$BASE$route"
    fi
    echo
  } > "$OUT/$file"
  echo "ok  $file"
}

# BUG-01 - frete cobrado com subtotal exatamente R$ 200,00 (2 x P005 a R$ 100,00)
capture bug-01-subtotal-200.txt POST /api/carrinho/calcular '{"itens":[{"produtoId":"P005","quantidade":2}]}'
# Controles do BUG-01: logo abaixo e logo acima do limite
capture bug-01-controle-subtotal-199-70.txt POST /api/carrinho/calcular '{"itens":[{"produtoId":"P002","quantidade":1},{"produtoId":"P006","quantidade":2}]}'
capture bug-01-controle-subtotal-209-90.txt POST /api/carrinho/calcular '{"itens":[{"produtoId":"P005","quantidade":1},{"produtoId":"P001","quantidade":1},{"produtoId":"P008","quantidade":1}]}'

# BUG-02 - quantidade acima de 5 aceita no cálculo e na confirmação do pedido
capture bug-02-calcular-quantidade-6.txt POST /api/carrinho/calcular '{"itens":[{"produtoId":"P001","quantidade":6}]}'
capture bug-02-pedido-quantidade-6.txt POST /api/pedidos '{"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[{"produtoId":"P001","quantidade":6}]}'

# BUG-03 - item sem produtoId devolve PRODUTO_NAO_ENCONTRADO em vez de ITEM_INVALIDO
capture bug-03-item-sem-produtoid.txt POST /api/carrinho/calcular '{"itens":[{"quantidade":1}]}'
# Controle do BUG-03: item que nem é objeto (esse sim devolve ITEM_INVALIDO)
capture bug-03-controle-item-nao-objeto.txt POST /api/carrinho/calcular '{"itens":["P001"]}'

# Cupom inválido no cálculo (200, sem erro HTTP) x no pedido (422)
capture cupom-invalido-calcular.txt POST /api/carrinho/calcular '{"itens":[{"produtoId":"P001","quantidade":1}],"cupom":"NAOEXISTE"}'
capture cupom-expirado-pedido.txt POST /api/pedidos '{"cliente":{"nome":"Maria Silva","email":"maria@exemplo.com","cep":"01310-100"},"itens":[{"produtoId":"P001","quantidade":1}],"cupom":"VERAO2026"}'
