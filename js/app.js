import { carregarProdutosApi } from './api.js';
import { obterFavoritos, salvarFavoritos, obterCarrinho, salvarCarrinho } from './storage.js';
import { renderProdutos, mostrarErro, renderCategorias, renderPaginacao, exibirModal, mostrarCarregamento } from './ui.js';

let todosProdutos = [];
let modoExibicao = 'todos'; 

let paginaAtual = 1;
const ITENS_POR_PAGINA = 12;

const campoBusca = document.getElementById('campoBusca');
const navTodos = document.getElementById('navTodos');
const navFavoritos = document.getElementById('navFavoritos');
const navCarrinho = document.getElementById('navCarrinho');
const filtroCategoria = document.getElementById('filtroCategoria');
const ordenacaoPreco = document.getElementById('ordenacaoPreco');

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

function alternarCarrinho(id) {
  let carrinho = obterCarrinho();
  if (carrinho.includes(id)) {
    carrinho = carrinho.filter(item => item !== id);
  } else {
    carrinho.push(id);
  }
  salvarCarrinho(carrinho);
  renderizarInterface();
}

// Nova função orquestradora do Modal
function verDetalhes(id) {
  const produto = todosProdutos.find(p => p.id === id);
  if (produto) {
    exibirModal(produto);
  }
}

function mudarPagina(novaPagina) {
  paginaAtual = novaPagina;
  renderizarInterface();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function processarProdutos() {
  const favoritos = obterFavoritos();
  const carrinho = obterCarrinho();
  
  let filtrados = [...todosProdutos];

  if (modoExibicao === 'favoritos') {
    filtrados = filtrados.filter(p => favoritos.includes(p.id));
  } else if (modoExibicao === 'carrinho') {
    filtrados = filtrados.filter(p => carrinho.includes(p.id));
  }

  const categoriaSelecionada = filtroCategoria.value;
  if (categoriaSelecionada) {
    filtrados = filtrados.filter(p => p.category === categoriaSelecionada);
  }

  const termoBusca = campoBusca.value.trim().toLowerCase();
  if (termoBusca) {
    filtrados = filtrados.filter(p => p.title.toLowerCase().includes(termoBusca));
  }

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
  const totalPaginas = Math.ceil(produtosProcessados.length / ITENS_POR_PAGINA);
  
  if (paginaAtual > totalPaginas && totalPaginas > 0) {
    paginaAtual = totalPaginas;
  }

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const produtosPagina = produtosProcessados.slice(inicio, fim);

  // Passando o callback 'verDetalhes' para o renderizador da interface
  renderProdutos(produtosPagina, alternarFavorito, alternarCarrinho, verDetalhes);
  renderPaginacao(totalPaginas, paginaAtual, mudarPagina);
}

function extrairERenderizarCategorias() {
  const categoriasUnicas = [...new Set(todosProdutos.map(p => p.category))].sort();
  renderCategorias(categoriasUnicas);
}

function alternarModo(modo) {
  modoExibicao = modo;
  paginaAtual = 1; 
  
  navTodos.classList.remove('active');
  navFavoritos.classList.remove('active');
  navCarrinho.classList.remove('active');

  if (modo === 'todos') navTodos.classList.add('active');
  if (modo === 'favoritos') navFavoritos.classList.add('active');
  if (modo === 'carrinho') navCarrinho.classList.add('active');

  renderizarInterface();
}

navTodos.addEventListener('click', (e) => { e.preventDefault(); alternarModo('todos'); });
navFavoritos.addEventListener('click', (e) => { e.preventDefault(); alternarModo('favoritos'); });
navCarrinho.addEventListener('click', (e) => { e.preventDefault(); alternarModo('carrinho'); });

campoBusca.addEventListener('input', () => { paginaAtual = 1; renderizarInterface(); });
filtroCategoria.addEventListener('change', () => { paginaAtual = 1; renderizarInterface(); });
ordenacaoPreco.addEventListener('change', () => { paginaAtual = 1; renderizarInterface(); });

async function init() {
  try {
    mostrarCarregamento();
    todosProdutos = await carregarProdutosApi();
    extrairERenderizarCategorias();
    renderizarInterface();
  } catch (erro) {
    console.error('Falha ao carregar produtos:', erro);
    mostrarErro();
  }
}

init();