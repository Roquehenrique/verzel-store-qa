const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');

const { When, Then } = createBdd();

const METHODS = { GET: 'get', POST: 'post', DELETE: 'delete', PUT: 'put' };

let lastResponse;

async function send(request, method, route, options) {
  lastResponse = await request[METHODS[method]](route, options);
}

function readPath(obj, path) {
  return path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), obj);
}

// Regex (não cucumber expression) porque o corpo é JSON cru - pode ter aspas, dois-pontos e
// chaves próprios, que não dá pra capturar com {string}.
When(/^envio "(\w+)" para "([^"]+)" com o corpo (.+)$/, async ({ request }, method, route, body) => {
  const options = {};
  if (body === 'not-json') {
    options.headers = { 'Content-Type': 'application/json' };
    options.data = 'not-json';
  } else if (body !== 'none') {
    options.data = JSON.parse(body);
  }
  await send(request, method, route, options);
});

When('envio POST \\/api\\/carrinho\\/calcular com um cupom inexistente', async ({ request }) => {
  await send(request, 'POST', '/api/carrinho/calcular', {
    data: { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'NAOEXISTE' },
  });
});

When(/^envio GET (\S+)$/, async ({ request }, route) => {
  await send(request, 'GET', route, {});
});

When('envio POST \\/api\\/carrinho\\/calcular com quantidade {int} de {string}', async ({ request }, quantidade, produtoId) => {
  await send(request, 'POST', '/api/carrinho/calcular', {
    data: { itens: [{ produtoId, quantidade }] },
  });
});

When('envio POST \\/api\\/pedidos com quantidade {int} de {string} e dados de cliente válidos', async ({ request }, quantidade, produtoId) => {
  await send(request, 'POST', '/api/pedidos', {
    data: {
      cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
      itens: [{ produtoId, quantidade }],
    },
  });
});

Then('a API deve responder {string} com o código {string}', async ({}, status, code) => {
  expect(lastResponse.status()).toBe(Number(status));
  const body = await lastResponse.json();
  expect(body.erro.codigo).toBe(code);
});

Then('a API deve responder {int}', async ({}, status) => {
  expect(lastResponse.status()).toBe(status);
});

Then('a API deve responder {int} com os dados do produto {string}', async ({}, status, productName) => {
  expect(lastResponse.status()).toBe(status);
  const body = await lastResponse.json();
  expect(body.nome).toBe(productName);
});

Then('o campo {string} deve ser {string}', async ({}, path, expected) => {
  const body = await lastResponse.json();
  expect(String(readPath(body, path))).toBe(expected);
});

Then('o campo {string} deve conter o motivo', async ({}, path) => {
  const body = await lastResponse.json();
  expect(readPath(body, path)).toBeTruthy();
});
