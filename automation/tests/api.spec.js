const { test, expect } = require('@playwright/test');

// Testes direto na API (/api), seguindo a tabela de códigos de erro que está na documentação:
// https://verzel-store.qa-test-verzel-store.workers.dev/documentacao

test.describe('API - códigos de erro documentados', () => {
  test('JSON inválido retorna 400 JSON_INVALIDO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      headers: { 'Content-Type': 'application/json' },
      data: 'nao-e-json',
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).erro.codigo).toBe('JSON_INVALIDO');
  });

  test('rota inexistente retorna 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    const res = await request.get('/api/rota-que-nao-existe');
    expect(res.status()).toBe(404);
    expect((await res.json()).erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });

  test('produto inexistente retorna 404 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    const res = await request.get('/api/produtos/P999');
    expect(res.status()).toBe(404);
    expect((await res.json()).erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
  });

  test('método não permitido retorna 405 METODO_NAO_PERMITIDO', async ({ request }) => {
    const res = await request.delete('/api/produtos');
    expect(res.status()).toBe(405);
    expect((await res.json()).erro.codigo).toBe('METODO_NAO_PERMITIDO');
  });

  test('lista de itens vazia retorna 422 ITENS_OBRIGATORIOS', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { itens: [] } });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('ITENS_OBRIGATORIOS');
  });

  test('item que não é um objeto retorna 422 ITEM_INVALIDO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', { data: { itens: ['P001'] } });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('ITEM_INVALIDO');
  });

  test('produto repetido na lista retorna 422 ITEM_DUPLICADO', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P001', quantidade: 2 }] },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('ITEM_DUPLICADO');
  });

  test('quantidade 0 retorna 422 QUANTIDADE_INVALIDA', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 0 }] },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_INVALIDA');
  });

  test('quantidade negativa retorna 422 QUANTIDADE_INVALIDA', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: -1 }] },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_INVALIDA');
  });

  test('quantidade decimal retorna 422 QUANTIDADE_INVALIDA', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1.5 }] },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_INVALIDA');
  });

  test('cupom que não existe em /api/pedidos retorna 422 CUPOM_INVALIDO', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens: [{ produtoId: 'P001', quantidade: 1 }],
        cupom: 'NAOEXISTE',
      },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('CUPOM_INVALIDO');
  });

  test('cupom expirado em /api/pedidos retorna 422 CUPOM_EXPIRADO', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: {
        cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' },
        itens: [{ produtoId: 'P001', quantidade: 1 }],
        cupom: 'VERAO2026',
      },
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('CUPOM_EXPIRADO');
  });

  test('dados do cliente ausentes retornam 422 DADOS_INVALIDOS', async ({ request }) => {
    const res = await request.post('/api/pedidos', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1 }] },
    });
    expect(res.status()).toBe(422);
    const corpo = await res.json();
    expect(corpo.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(corpo.erro.campos.length).toBeGreaterThanOrEqual(3);
  });

  test('cupom inválido em /api/carrinho/calcular não dá erro HTTP, só avisa no corpo da resposta', async ({ request }) => {
    const res = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 1 }], cupom: 'NAOEXISTE' },
    });
    expect(res.status()).toBe(200);
    const corpo = await res.json();
    expect(corpo.cupom.aplicado).toBe(false);
    expect(corpo.cupom.mensagem).toBeTruthy();
  });
});
