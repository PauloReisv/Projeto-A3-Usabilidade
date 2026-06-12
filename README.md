# Catálogo Essenza - Projeto A3 Usabilidade

Este repositório contém o código-fonte do projeto **Catálogo Essenza**, desenvolvido para a disciplina de **Usabilidade** (Projeto A3). O projeto consiste em uma interface de catálogo de produtos moderna e responsiva, focada na experiência do usuário e na facilidade de navegação.

## 🚀 Sobre o Projeto

O **Catálogo Essenza** é uma aplicação web que permite aos usuários visualizar, buscar e filtrar produtos de forma intuitiva. A interface foi construída utilizando tecnologias web modernas para garantir uma navegação fluida em diferentes dispositivos.

## ✅ Requisitos Cumpridos

* **Consumo de API Pública:** Obtenção de dados via `fetch()` utilizando a API DummyJSON.
* **Manipulação de DOM:** Criação, leitura e atualização de elementos utilizando JavaScript Vanilla.
* **Persistência de Dados:** Salvamento de estados (favoritos e carrinho) diretamente no `localStorage` do navegador.
* **Desenvolvimento Front-end Nativo:** Construção com HTML, CSS e JavaScript sem utilização de frameworks JS como React ou Angular.
* **Estrutura de Exibição:** Cards de produtos contendo obrigatoriamente nome, preço, imagem e categoria.

### Funcionalidades Principais:
*   **Listagem e Paginação Dinâmicas:** Exibição em grid responsivo com separação dos resultados em múltiplas páginas.
*   **Busca e Filtros em Tempo Real:** Filtragem dinâmica pelo título, por categoria (mapeada diretamente da API) e ordenação por preço (crescente/decrescente).
*   **Filtros por Categoria:** Organização de produtos por categorias específicas.
*   **Ordenação por Preço:** Opção de ordenar os produtos do menor para o maior preço e vice-versa.
*   **Favoritos e Carrinho:** Interface preparada para gerenciamento de itens favoritos e seleção de compras.
*   **Responsividade:** Design adaptável para desktops, tablets e smartphones.

## 🚀 Funcionalidades Implementadas


* **Favoritos e Carrinho:** Áreas dedicadas para visualizar exclusivamente itens favoritados ou adicionados ao carrinho, com persistência local.
* **Modal de Detalhes:** Interface de visualização aprofundada de cada produto desenvolvida com eventos de clique puros.
* **Estado de Carregamento (Loading):** Implementação de spinner visual para gerenciar a espera durante as chamadas de rede e tratativa de erro em caso de falha.

## 🛠️ Tecnologias Utilizadas

*   **HTML5:** Estruturação semântica do conteúdo.
*   **CSS3:** Estilização personalizada e layouts modernos.
*   **JavaScript (ES6+):** Lógica de manipulação do DOM, filtros e interatividade.
*   **Bootstrap 5:** Framework para componentes de interface e sistema de grid responsivo.
*   **Google Fonts:** Tipografia selecionada (Playfair Display e Lato) para melhor legibilidade.
*   **Bootstrap Icons:** Biblioteca de ícones vetoriais.

## 📂 Estrutura do Repositório

```txt
/
├── index.html       # Arquivo principal contendo a marcação da interface
├── README.md        # Documentação do projeto
├── css/
│   └── style.css    # Regras de estilização customizadas
└── js/
    ├── api.js       # Comunicação assíncrona com a API externa
    ├── app.js       # Lógica principal, processamento de filtros e estados
    ├── storage.js   # Manipulação e formatação de dados do localStorage
    └── ui.js        # Renderização HTML e escuta de eventos do DOM

## 👥 Integrantes do Grupo (Entrega A3)

Conforme as orientações da entrega, seguem abaixo os dados de todos os participantes do grupo:

| Nome Completo | RA |
| :--- | :--- |
| **Paulo Victor Peres Reis** | `82324291` |
| **Daniel Trejo Barbosa Santos** | `824110132` |
| **Kevin de Santana Carvalho** | `823210275` |
| **André Rodrigues Castanheda** | `823123713` |
| **Eric Bortoleto Silva** | `82325822` |
| **Victor José dos Santos** | `823227108` |
| **João Paulo Eugênio de Souza** | `823124300` |

---
*Que a força do JavaScript esteja com todos!* 🚀✨
