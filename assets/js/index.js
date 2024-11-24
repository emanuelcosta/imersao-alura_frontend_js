import fetchImages from "./fetchApis";

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");
const deleteBtn = document.querySelector('#deletePost');
modal.style.display = "none";

const imageGrid = document.querySelector(".image-grid");

// Função para buscar e exibir os dados do endpoint
async function displayImages() {
  const data = await fetchImages();
    try {
        const postsList = data.map(item => {
          return `
            <article data-description="${item.descricao}" data-id="${item._id}">
              <figure>
                <img src="${item.imgUrl}" alt="${item.alt}" />
              </figure>
            </article>
          `
        }).join('');
        imageGrid.insertAdjacentHTML('beforeend', postsList)

        // Adicionando eventos de clique para cada imagem carregada
        addImageClickEvents();
    } catch (error) {
        console.error("Erro ao popular página", error);
    }
}

// Função para adicionar os eventos de clique às imagens
function addImageClickEvents() {
    const images = document.querySelectorAll(".image-grid img");
    images.forEach(img => {
        img.addEventListener("click", function () {
            captionText.textContent = "";
            modal.style.display = "block";
            modalImg.src = this.src;

            const article = this.closest("article");
            const description = article ? article.dataset.description : '';
            const caption = description || this.alt;

            captionText.innerHTML = `<p>${caption}</p>`;

            deleteBtn.addEventListener("click", function () {
              deletarPost(article)
          });
        });
    });
}

function deletarPost(articleParam) {
  const postId = articleParam.dataset.id;
  // Construindo a URL com o ID do post
  const url = `http://localhost:3000/posts/`;

  // Corpo da requisição no formato JSON
  const data = JSON.stringify({ id: postId });

  // Opções da requisição
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  };

  // Fazendo a requisição com o fetch
  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao deletar o post');
      }
      return response.json();
    })
    .then(data => {
      console.log('Post deletado com sucesso:', data);
      alert('Post deletado com sucesso');
      articleParam.remove();
      modal.style.display = "none";
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Evento de fechar o modal
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Fechar o modal clicando fora dele
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Chamar a função para buscar e exibir as imagens ao carregar a página
document.addEventListener("DOMContentLoaded", displayImages);
