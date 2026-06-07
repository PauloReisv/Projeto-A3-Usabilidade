// ========== VARIÁVEIS GLOBAIS ==========
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
  const classeCoracao = favorito ? 'bi-heart-fill fav-icon' : 'bi-heart fav-icon';
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 border p-4">
      <div class="card h-100">
        <!-- Imagem de capa (thumbnail) -->
        <img src="${produto.thumbnail}" class="card-img-top" alt="${produto.title}"
             style="max-height: 100px; object-fit: cover;">
        <!-- Imagem redonda sobreposta -->
        <div class="d-flex justify-content-center" style="margin-top: -40px;">
          <img src="${produto.images[0] || produto.thumbnail}" alt="${produto.title}"
               style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
                      border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
        </div>
        <div class="card-body">
          <div class="fw-bold">${produto.title}</div>
          <div class="fw-light" style="font-size: 10pt">$${produto.price.toFixed(2)}</div>
          <p class="text-secondary fs-6">
            ${produto.description.slice(0, 80)}...
          </p>
          <div class="d-flex justify-content-around align-items-center">
            <i class="bi ${classeCoracao}" data-id="${produto.id}" aria-label="Favoritar"></i>
            <button class="btn btn-outline-secondary btn-sm favorite-btn" data-id="${produto.id}">
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

  // Eventos de favoritar (ícone coração e botão)
  document.querySelectorAll('.fav-icon, .favorite-btn').forEach(elemento => {
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