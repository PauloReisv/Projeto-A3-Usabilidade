// ========== VARIÁVEIS ==========
let todosProdutos = [];
let favoritos = [];
let exibindoFavoritos = false;

const containerProdutos = document.getElementById('containerProdutos');
const campoBusca = document.getElementById('campoBusca');
const mensagemVazia = document.getElementById('mensagemVazia');
const navTodos = document.getElementById('navTodos');
const navFavoritos = document.getElementById('navFavoritos');

// ========== STORAGE ==========
function carregarFavoritosStorage() {
  const salvos = localStorage.getItem('favoritos');
  if (salvos) {
    try {
      favoritos = JSON.parse(salvos);
    } catch (e) {
      favoritos = [];
    }
  }
}

function salvarFavoritosStorage() {
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function isFavorito(id) {
  return favoritos.includes(id);
}

// ========== API ==========
async function carregarProdutos() {
  try {
    const resposta = await fetch('https://dummyjson.com/products?limit=100');
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    const dados = await resposta.json();
    todosProdutos = dados.products;
    renderizarInterface();
  } catch (erro) {
    console.error('Falha ao carregar produtos:', erro);
    containerProdutos.innerHTML = `
      <div class="col-12 text-center text-danger">
        <h4>Erro ao carregar produtos</h4>
        <p>Verifique sua conexão com a internet e tente novamente.</p>
      </div>`;
  }
}

// ========== RENDERIZAÇÃO ==========
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
            <i class="bi ${classeCoracao} heart-icon" data-id="${produto.id}" aria-label="Favoritar"></i>
            <button class="btn-favoritar favorite-btn" data-id="${produto.id}">
              <i class="bi bi-star me-1"></i> Favoritar
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderProdutos(produtos) {
  if (!produtos.length) {
    containerProdutos.innerHTML = '';
    mensagemVazia.style.display = 'block';
    return;
  }
  mensagemVazia.style.display = 'none';
  containerProdutos.innerHTML = produtos.map(criarCard).join('');

  document.querySelectorAll('.heart-icon, .favorite-btn').forEach(elemento => {
    elemento.addEventListener('click', (e) => {
      const id = Number(elemento.dataset.id);
      alternarFavorito(id);
    });
  });
}

function alternarFavorito(id) {
  if (isFavorito(id)) {
    favoritos = favoritos.filter(fav => fav !== id);
  } else {
    favoritos.push(id);
  }
  salvarFavoritosStorage();
  renderizarInterface();
}

function renderizarInterface() {
  let produtosAtivos = exibindoFavoritos
    ? todosProdutos.filter(p => favoritos.includes(p.id))
    : todosProdutos;

  const termoBusca = campoBusca.value.trim().toLowerCase();
  if (termoBusca) {
    produtosAtivos = produtosAtivos.filter(p =>
      p.title.toLowerCase().includes(termoBusca)
    );
  }
  renderProdutos(produtosAtivos);
}

// ========== NAVEGAÇÃO ==========
function alternarModo(modoFavoritos) {
  exibindoFavoritos = modoFavoritos;
  if (modoFavoritos) {
    navTodos.classList.remove('active');
    navFavoritos.classList.add('active');
  } else {
    navFavoritos.classList.remove('active');
    navTodos.classList.add('active');
  }
  renderizarInterface();
}

navTodos.addEventListener('click', (e) => {
  e.preventDefault();
  alternarModo(false);
});

navFavoritos.addEventListener('click', (e) => {
  e.preventDefault();
  alternarModo(true);
});

campoBusca.addEventListener('input', () => {
  renderizarInterface();
});

// ========== INICIALIZAÇÃO ==========
function init() {
  carregarFavoritosStorage();
  carregarProdutos();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}