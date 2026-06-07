export function obterFavoritos() {
  const salvos = localStorage.getItem('favoritos');
  if (salvos) {
    try {
      return JSON.parse(salvos);
    } catch (e) {
      return [];
    }
  }
  return [];
}

export function salvarFavoritos(favoritos) {
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

export function isFavorito(id) {
  return obterFavoritos().includes(id);
}