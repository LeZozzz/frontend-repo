document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const movieDetails = document.getElementById('movie-details');
    const API_KEY = '538568d7';

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const movieId = urlParams.get('id');


    document.getElementById('login-btn')?.addEventListener('click', () => {
        window.location.href = "login.html";
    });

    // Si on arrive avec une requête dans l'URL (depuis details.html)
    if (searchQuery && input && form && movieList) {
        input.value = searchQuery;
        searchMovies(searchQuery);
    }

    // Si on arrive avec un id de film dans l'URL (depuis un clic sur un film)
    if (movieId && movieDetails) {
        fetchMovieDetails(movieId);
    }

    if (form && input) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = input.value.trim();
            if (query !== '') {
                window.location.href = `home.html?query=${encodeURIComponent(query)}`;
            }
        });
    }

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

    // Nouvelle fonction pour afficher les détails d'un film
    async function fetchMovieDetails(id) {
        const url = `https://www.omdbapi.com/?i=${encodeURIComponent(id)}&apikey=${API_KEY}&plot=full`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                // Convertir la durée en format "1h20" si possible
                let formattedRuntime = data.Runtime;
                if (data.Runtime && data.Runtime.endsWith('min')) {
                    const minutes = parseInt(data.Runtime);
                    if (!isNaN(minutes)) {
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        formattedRuntime = hours > 0
                            ? `${hours}h${mins > 0 ? mins : ''}`
                            : `${mins}min`;
                    }
                }
                movieDetails.innerHTML = `
                    <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${data.Title}">
                    <div class="movie-info">
                        <h2>${data.Title} (${data.Year})</h2>
                        <p><strong>Genre :</strong> ${data.Genre}</p>
                        <p><strong>Durée :</strong> ${formattedRuntime}</p>
                        <p><strong>Réalisateur :</strong> ${data.Director}</p>
                        <p><strong>Acteurs :</strong> ${data.Actors}</p>
                        <p><strong>Résumé :</strong> ${data.Plot}</p>
                    </div>
                `;
            } else {
                movieDetails.innerHTML = `<p>Film introuvable.</p>`;
            }
        } catch (error) {
            movieDetails.innerHTML = `<p>Erreur lors du chargement des détails du film.</p>`;
        }
    }
});
