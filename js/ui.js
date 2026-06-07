import { isFavorito, isNoCarrinho } from './storage.js';

const containerProdutos = document.getElementById('containerProdutos');
const mensagemVazia = document.getElementById('mensagemVazia');
const traducaoCategorias = {
  'beauty': 'Beleza',
  'fragrances': 'Fragrâncias',
  'furniture': 'Móveis',
  'groceries': 'Mercearia/Alimentos',
  'home-decoration': 'Decoração',
  'kitchen-accessories': 'Acessórios de Cozinha',
  'laptops': 'Notebooks',
  'mens-shirts': 'Camisas Masculinas',
  'mens-shoes': 'Sapatos Masculinos',
  'mobile-accessories': 'Acessórios para Celular',
  'motorcycle': 'Motocicletas',
  'skin-care': 'Cuidados com a Pele',
  'smartphones': 'Smartphones',
  'sports-accessories': 'Acessórios Esportivos',
  'sunglasses': 'Óculos de Sol',
  'tablets': 'Tablets',
  'tops': 'Roupas Superiores',
  'vehicle': 'Veículos',
  'womens-bags': 'Bolsas Femininas',
  'womens-dresses': 'Vestidos Femininos',
  'womens-jewellery': 'Joias Femininas',
  'womens-shoes': 'Sapatos Femininos',
  'watches': 'Relógios'
};

function criarCard(produto) {
  const favorito = isFavorito(produto.id);
  const classeEstrela = favorito ? 'bi-star-fill' : 'bi-star';
  const noCarrinho = isNoCarrinho(produto.id);
  const classeCarrinho = noCarrinho ? 'bi-cart-fill' : 'bi-cart';

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
          <div class="product-actions d-flex justify-content-between">
            <button class="btn-acao favorite-btn" data-id="${produto.id}" title="Favoritar">
              <i class="bi ${classeEstrela}"></i>
            </button>
            <button class="btn-acao cart-btn" data-id="${produto.id}" title="Adicionar ao Carrinho">
              <i class="bi ${classeCarrinho}"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

export function renderProdutos(produtos, onAlternarFavorito, onAlternarCarrinho) {
  if (!produtos.length) {
    containerProdutos.innerHTML = '';
    mensagemVazia.style.display = 'block';
    return;
  }
  
  mensagemVazia.style.display = 'none';
  containerProdutos.innerHTML = produtos.map(criarCard).join('');

  document.querySelectorAll('.favorite-btn').forEach(elemento => {
    elemento.addEventListener('click', () => {
      onAlternarFavorito(Number(elemento.dataset.id));
    });
  });

  document.querySelectorAll('.cart-btn').forEach(elemento => {
    elemento.addEventListener('click', () => {
      onAlternarCarrinho(Number(elemento.dataset.id));
    });
  });
}

export function renderCategorias(categorias) {
  const selectCategoria = document.getElementById('filtroCategoria');
  const optionsHTML = categorias.map(cat => {
    const nomeTraduzido = traducaoCategorias[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
    return `<option value="${cat}">${nomeTraduzido}</option>`;
  }).join('');
  selectCategoria.innerHTML = `<option value="">Todas as Categorias</option>` + optionsHTML;
}

export function renderPaginacao(totalPaginas, paginaAtual, onMudarPagina) {
  const container = document.getElementById('paginacaoContainer');
  if (totalPaginas <= 1) {
    container.innerHTML = '';
    return;
  }
  let html = '';
  for (let i = 1; i <= totalPaginas; i++) {
    const active = i === paginaAtual ? 'active' : '';
    html += `<li class="page-item ${active}"><button class="page-link" data-page="${i}">${i}</button></li>`;
  }
  container.innerHTML = html;
  container.querySelectorAll('.page-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      onMudarPagina(Number(e.target.dataset.page));
    });
  });
}

export function mostrarErro() {
  containerProdutos.innerHTML = `
    <div class="col-12 text-center text-danger">
      <h4>Erro ao carregar produtos</h4>
      <p>Verifique a sua ligação à internet e tente novamente.</p>
    </div>`;
}