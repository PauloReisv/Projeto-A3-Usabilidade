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
  const classeEstrela = favorito ? 'bi-star-fill favorite-active' : 'bi-star';
  return `
    <div class="col-md-4 col-lg-3">
      <div class="card h-100">
        <img src="${produto.thumbnail}" class="card-img-top" alt="${produto.title}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-secondary mb-2 align-self-start">${produto.category}</span>
          <h5 class="card-title">${produto.title}</h5>
          <p class="card-text text-success fw-bold fs-5">$${produto.price.toFixed(2)}</p>
          <button class="btn btn-outline-warning mt-auto favorite-btn" data-id="${produto.id}" aria-label="Favoritar">
            <i class="bi ${classeEstrela}"></i>
          </button>
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
  document.querySelectorAll('.favorite-btn').forEach(botao => {
    botao.addEventListener('click', (evento) => {
      const id = Number(botao.dataset.id);
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