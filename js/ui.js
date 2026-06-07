import { isFavorito } from './storage.js';

const containerProdutos = document.getElementById('containerProdutos');
const mensagemVazia = document.getElementById('mensagemVazia');

function criarCard(produto) {
  const favorito = isFavorito(produto.id);
  const classeCoracao = favorito ? 'bi-heart-fill' : 'bi-heart';

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div class="product-card">
        <img src="${produto.thumbnail}" class="card-img-top-cover w-100" alt="${produto.title}">
        <div class="img-avatar-wrapper">
          <img src="${produto.images[0] || produto.thumbnail}" class="img-avatar" alt="${produto.title}">
        </div>
        <div class="card-body-custom">
          <div class="product-title">${produto.title}</div>
          <div class="product-price">R$ ${produto.price.toFixed(2)}</div>
          <p class="product-description">${produto.description.slice(0, 70)}...</p>
          <div class="product-actions">
            <i class="bi ${classeCoracao} heart-icon" data-id="${produto.id}" aria-label="Favoritar" style="cursor: pointer;"></i>
            <button class="btn-favoritar favorite-btn" data-id="${produto.id}">
              <i class="bi bi-star me-1"></i> Favoritar
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

export function renderProdutos(produtos, onAlternarFavorito) {
  if (!produtos.length) {
    containerProdutos.innerHTML = '';
    mensagemVazia.style.display = 'block';
    return;
  }
  
  mensagemVazia.style.display = 'none';
  containerProdutos.innerHTML = produtos.map(criarCard).join('');

  document.querySelectorAll('.heart-icon, .favorite-btn').forEach(elemento => {
    elemento.addEventListener('click', () => {
      const id = Number(elemento.dataset.id);
      onAlternarFavorito(id);
    });
  });
}

export function mostrarErro() {
  containerProdutos.innerHTML = `
    <div class="col-12 text-center text-danger">
      <h4>Erro ao carregar produtos</h4>
      <p>Verifique sua conexão com a internet e tente novamente.</p>
    </div>`;
}