import { isFavorito } from './storage.js';

const containerProdutos = document.getElementById('containerProdutos');
const mensagemVazia = document.getElementById('mensagemVazia');
// Objeto de mapeamento para tradução das categorias da DummyJSON API
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
            <button class="btn-favoritar favorite-btn" data-id="${produto.id}">
              <i class="bi ${classeEstrela} me-1"></i> Favoritar
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

  document.querySelectorAll('.favorite-btn').forEach(elemento => {
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

export function renderCategorias(categorias) {
  const selectCategoria = document.getElementById('filtroCategoria');
  
  const optionsHTML = categorias.map(cat => {
    // Busca a tradução. Se não existir no objeto, exibe o termo original capitalizado.
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