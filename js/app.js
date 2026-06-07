import { carregarProdutosApi } from './api.js';
import { obterFavoritos, salvarFavoritos } from './storage.js';
import { renderProdutos, mostrarErro, renderCategorias, renderPaginacao } from './ui.js';

// ========== ESTADOS GLOBAIS ==========
let todosProdutos = [];
let exibindoFavoritos = false;

// Estados de Filtro e Paginação
let paginaAtual = 1;
const ITENS_POR_PAGINA = 12;

// ========== ELEMENTOS DOM ==========
const campoBusca = document.getElementById('campoBusca');
const navTodos = document.getElementById('navTodos');
const navFavoritos = document.getElementById('navFavoritos');
const filtroCategoria = document.getElementById('filtroCategoria');
const ordenacaoPreco = document.getElementById('ordenacaoPreco');

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

function mudarPagina(novaPagina) {
  paginaAtual = novaPagina;
  renderizarInterface();
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo ao mudar de página
}

function processarProdutos() {
  const favoritos = obterFavoritos();
  
  // 1. Filtro de Aba (Todos vs Favoritos)
  let filtrados = exibindoFavoritos
    ? todosProdutos.filter(p => favoritos.includes(p.id))
    : [...todosProdutos];

  // 2. Filtro de Categoria
  const categoriaSelecionada = filtroCategoria.value;
  if (categoriaSelecionada) {
    filtrados = filtrados.filter(p => p.category === categoriaSelecionada);
  }

  // 3. Filtro de Busca Textual
  const termoBusca = campoBusca.value.trim().toLowerCase();
  if (termoBusca) {
    filtrados = filtrados.filter(p => p.title.toLowerCase().includes(termoBusca));
  }

  // 4. Ordenação por Preço
  const ordem = ordenacaoPreco.value;
  if (ordem === 'asc') {
    filtrados.sort((a, b) => a.price - b.price);
  } else if (ordem === 'desc') {
    filtrados.sort((a, b) => b.price - a.price);
  }

  return filtrados;
}

function renderizarInterface() {
  const produtosProcessados = processarProdutos();
  
  // Lógica de Paginação
  const totalPaginas = Math.ceil(produtosProcessados.length / ITENS_POR_PAGINA);
  
  // Correção de segurança caso o filtro deixe a página atual vazia
  if (paginaAtual > totalPaginas && totalPaginas > 0) {
    paginaAtual = totalPaginas;
  }

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const produtosPagina = produtosProcessados.slice(inicio, fim);

  // Renderização
  renderProdutos(produtosPagina, alternarFavorito);
  renderPaginacao(totalPaginas, paginaAtual, mudarPagina);
}

function extrairERenderizarCategorias() {
  // Cria um array com categorias únicas
  const categoriasUnicas = [...new Set(todosProdutos.map(p => p.category))].sort();
  renderCategorias(categoriasUnicas);
}

function alternarModo(modoFavoritos) {
  exibindoFavoritos = modoFavoritos;
  paginaAtual = 1; // Reseta a paginação ao trocar de aba
  
  if (modoFavoritos) {
    navTodos.classList.remove('active');
    navFavoritos.classList.add('active');
  } else {
    navFavoritos.classList.remove('active');
    navTodos.classList.add('active');
  }
  renderizarInterface();
}

// ========== EVENTOS ==========
navTodos.addEventListener('click', (e) => {
  e.preventDefault();
  alternarModo(false);
});

navFavoritos.addEventListener('click', (e) => {
  e.preventDefault();
  alternarModo(true);
});

// Eventos que resetam a paginação para 1
campoBusca.addEventListener('input', () => { paginaAtual = 1; renderizarInterface(); });
filtroCategoria.addEventListener('change', () => { paginaAtual = 1; renderizarInterface(); });
ordenacaoPreco.addEventListener('change', () => { paginaAtual = 1; renderizarInterface(); });

// ========== INICIALIZAÇÃO ==========
async function init() {
  try {
    todosProdutos = await carregarProdutosApi();
    extrairERenderizarCategorias();
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