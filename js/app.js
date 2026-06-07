import { carregarProdutosApi } from './api.js';
import { obterFavoritos, salvarFavoritos } from './storage.js';
import { renderProdutos, mostrarErro } from './ui.js';

// ========== VARIÁVEIS GLOBAIS ==========
let todosProdutos = [];
let exibindoFavoritos = false;

const campoBusca = document.getElementById('campoBusca');
const navTodos = document.getElementById('navTodos');
const navFavoritos = document.getElementById('navFavoritos');

// ========== LÓGICA DE NEGÓCIO ==========
function alternarFavorito(id) {
  let favoritos = obterFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(fav => fav !== id);
  } else {
    favoritos.push(id);
  }
  salvarFavoritos(favoritos);
  renderizarInterface();
}

function renderizarInterface() {
  const favoritos = obterFavoritos();
  let produtosAtivos = exibindoFavoritos
    ? todosProdutos.filter(p => favoritos.includes(p.id))
    : todosProdutos;

  const termoBusca = campoBusca.value.trim().toLowerCase();
  if (termoBusca) {
    produtosAtivos = produtosAtivos.filter(p =>
      p.title.toLowerCase().includes(termoBusca)
    );
  }
  renderProdutos(produtosAtivos, alternarFavorito);
}

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

// ========== EVENTOS DE NAVEGAÇÃO ==========
navTodos.addEventListener('click', (e) => {
  e.preventDefault();
  alternarModo(false);
});

navFavoritos.addEventListener('click', (e) => {
  e.preventDefault();
  alternarModo(true);
});

campoBusca.addEventListener('input', renderizarInterface);

// ========== INICIALIZAÇÃO ==========
async function init() {
  try {
    todosProdutos = await carregarProdutosApi();
    renderizarInterface();
  } catch (erro) {
    console.error('Falha ao carregar produtos:', erro);
    mostrarErro();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}