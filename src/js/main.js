document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const API_KEY = '538568d7'; // Ta clé API

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        const query = input.value.trim();
        if (query === '') return;

        const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        console.log('Requête URL:', url); // Pour debug

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Réponse de l\'API:', data); // Pour debug

            if (data.Response === "True") {
                movieList.innerHTML = ''; // Vide la liste

                // ✅ Créer les cartes ici, à l'intérieur du bloc if
                data.Search.forEach((movie) => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.innerHTML = `
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.Title}">
                        <h3>${movie.Title} (${movie.Year})</h3>
                    `;

                    // ✅ Redirection au clic
                    movieCard.addEventListener('click', () => {
                        window.location.href = `details.html?id=${movie.imdbID}`;
                    });

                    movieList.appendChild(movieCard);
                });
            } else {
                movieList.innerHTML = `<p>Aucun film trouvé avec ce titre.</p>`;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du film:', error);
            movieList.innerHTML = `<p>Une erreur est survenue.</p>`;
        }
    });
});
