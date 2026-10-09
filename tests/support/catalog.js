// Product catalog used by the step definitions (name as shown on the site, list index, price).

const PRODUCTS = [
  { index: 0, id: 'P001', name: 'Camiseta Essencial', price: 59.9 },
  { index: 1, id: 'P002', name: 'Calça Jeans Slim', price: 139.9 },
  { index: 2, id: 'P003', name: 'Tênis Casual Urbano', price: 189.9 },
  { index: 3, id: 'P004', name: 'Boné Aba Curva', price: 49.9 },
  { index: 4, id: 'P005', name: 'Mochila Urbana 20L', price: 100.0 },
  { index: 5, id: 'P006', name: 'Kit 3 Pares de Meias', price: 29.9 },
  { index: 6, id: 'P007', name: 'Jaqueta Corta-Vento', price: 229.9 },
  { index: 7, id: 'P008', name: 'Garrafa Térmica 750ml', price: 50.0 },
];

function findByName(name) {
  const product = PRODUCTS.find((p) => p.name === name);
  if (!product) throw new Error(`Unknown product in catalog: "${name}"`);
  return product;
}

// Known product combinations that reach a given cart subtotal. Needed because the store
// only has 8 fixed-price products (max 5 units each), so scenarios build specific subtotals
// from specific combos rather than arbitrary amounts.
const SUBTOTAL_RECIPES = {
  'R$ 209,90': [{ index: 4, qty: 1 }, { index: 0, qty: 1 }, { index: 7, qty: 1 }],
  'R$ 200,00': [{ index: 4, qty: 2 }],
  'R$ 199,70': [{ index: 1, qty: 1 }, { index: 5, qty: 2 }],
  'R$ 239,70': [{ index: 1, qty: 1 }, { index: 3, qty: 2 }],
  'R$ 59,90': [{ index: 0, qty: 1 }],
};

module.exports = { PRODUCTS, findByName, SUBTOTAL_RECIPES };
