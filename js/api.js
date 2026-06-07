export async function carregarProdutosApi() {
  const resposta = await fetch('https://dummyjson.com/products?limit=100');
  if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
  const dados = await resposta.json();
  return dados.products;
}