document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const API_KEY = '538568d7'; // Ta clé API

    // Si on arrive avec une requête dans l'URL (depuis details.html)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const welcomeSection = document.getElementById('welcome-section');
    const recommendationsSection = document.getElementById('recommendations');

    if (searchQuery && searchQuery.trim() !== "") {
        // Masquer le message de bienvenue, afficher les résultats
        if (welcomeSection) welcomeSection.style.display = 'none';
        if (recommendationsSection) recommendationsSection.style.display = '';
    } else {
        // Afficher le message de bienvenue, masquer les résultats
        if (welcomeSection) welcomeSection.style.display = '';
        if (recommendationsSection) recommendationsSection.style.display = 'none';
    }

    if (searchQuery) {
        input.value = searchQuery;
        searchMovies(searchQuery);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query !== '') {
            // Redirige vers la même page avec le paramètre query dans l'URL
            window.location.href = `index.html?query=${encodeURIComponent(query)}`;
        }
    });

    async function searchMovies(query) {
        const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                document.getElementById('search-result-title').textContent = `Résultats trouvés pour : "${query}"`;
                movieList.innerHTML = '';
                data.Search.forEach((movie) => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.innerHTML = `
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.Title}">
                        <h3>${movie.Title} (${movie.Year})</h3>
                    `;
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
    }
});
