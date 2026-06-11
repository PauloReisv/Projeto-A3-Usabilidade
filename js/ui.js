import { isFavorito, isNoCarrinho } from './storage.js';

const containerProdutos = document.getElementById('containerProdutos');
const mensagemVazia = document.getElementById('mensagemVazia');

const traducaoCategorias = {
  'beauty': 'Beleza', 'fragrances': 'Fragrâncias', 'furniture': 'Móveis',
  'groceries': 'Mercearia/Alimentos', 'home-decoration': 'Decoração',
  'kitchen-accessories': 'Acessórios de Cozinha', 'laptops': 'Notebooks',
  'mens-shirts': 'Camisas Masculinas', 'mens-shoes': 'Sapatos Masculinos',
  'mobile-accessories': 'Acessórios para Celular', 'motorcycle': 'Motocicletas',
  'skin-care': 'Cuidados com a Pele', 'smartphones': 'Smartphones',
  'sports-accessories': 'Acessórios Esportivos', 'sunglasses': 'Óculos de Sol',
  'tablets': 'Tablets', 'tops': 'Roupas Superiores', 'vehicle': 'Veículos',
  'womens-bags': 'Bolsas Femininas', 'womens-dresses': 'Vestidos Femininos',
  'womens-jewellery': 'Joias Femininas', 'womens-shoes': 'Sapatos Femininos',
  'watches': 'Relógios'
};

function criarCard(produto) {
  const favorito = isFavorito(produto.id);
  const classeEstrela = favorito ? 'bi-star-fill' : 'bi-star';
  
  const noCarrinho = isNoCarrinho(produto.id);
  const classeCarrinho = noCarrinho ? 'bi-cart-fill' : 'bi-cart';

  const nomeCategoria = traducaoCategorias[produto.category] || produto.category;

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div class="product-card">
        <div class="detalhes-gatilho" data-id="${produto.id}" style="cursor: pointer;">
          <img src="${produto.thumbnail}" class="card-img-top-cover w-100" alt="${produto.title}">
        </div>
        <div class="card-body-custom">
          <span class="badge bg-secondary mb-2">${nomeCategoria}</span>
          <div class="product-title detalhes-gatilho" data-id="${produto.id}" style="cursor: pointer;">${produto.title}</div>
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

export function mostrarCarregamento() {
  containerProdutos.innerHTML = `
    <div class="col-12 d-flex flex-column align-items-center justify-content-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-3 text-muted">Carregando produtos...</p>
    </div>`;
  mensagemVazia.style.display = 'none';
}

export function renderProdutos(produtos, onAlternarFavorito, onAlternarCarrinho, onVerDetalhes) {
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

  document.querySelectorAll('.detalhes-gatilho').forEach(elemento => {
    elemento.addEventListener('click', () => {
      onVerDetalhes(Number(elemento.dataset.id));
    });
  });
}

// Lógica de manipulação manual do Modal baseado em CSS puro do Bootstrap
export function exibirModal(produto) {
  const modal = document.getElementById('modalDetalhes');
  const backdrop = document.getElementById('modalBackdrop');
  const titulo = document.getElementById('modalDetalhesTitulo');
  const corpo = document.getElementById('modalDetalhesCorpo');

  titulo.textContent = produto.title;
  corpo.innerHTML = `
    <div class="text-center mb-4">
      <img src="${produto.thumbnail}" class="img-fluid rounded" style="max-height: 200px; object-fit: contain;" alt="${produto.title}">
    </div>
    <div class="mb-2"><strong>Categoria:</strong> ${traducaoCategorias[produto.category] || produto.category}</div>
    <div class="mb-2"><strong>Preço:</strong> R$ ${produto.price.toFixed(2)}</div>
    <div class="mb-2"><strong>Avaliação:</strong> ⭐ ${produto.rating}</div>
    <div class="mb-2"><strong>Estoque:</strong> ${produto.stock} unidades disponíveis</div>
    <div class="mt-3">
      <strong>Descrição Completa:</strong>
      <p class="text-muted small mt-1" style="line-height: 1.5;">${produto.description}</p>
    </div>
  `;

  modal.style.display = 'block';
  backdrop.style.display = 'block';
  
  // Forçar reflow do navegador para engatar a transição CSS de fade
  modal.offsetHeight; 
  
  modal.classList.add('show');
  backdrop.classList.add('show');
  document.body.classList.add('modal-open');
}

export function fecharModal() {
  const modal = document.getElementById('modalDetalhes');
  const backdrop = document.getElementById('modalBackdrop');

  modal.classList.remove('show');
  backdrop.classList.remove('show');

  setTimeout(() => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
    document.body.classList.remove('modal-open');
  }, 150); // Aguarda o fim da animação fade-out do CSS
}

// Listeners internos do ciclo de vida da interface
document.getElementById('btnFecharModal')?.addEventListener('click', fecharModal);
document.getElementById('modalDetalhes')?.addEventListener('click', (e) => {
  if (e.target.id === 'modalDetalhes') fecharModal();
});

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