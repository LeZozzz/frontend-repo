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
    const trendingSection = document.getElementById('trending-section');

    if (searchQuery && searchQuery.trim() !== "") {
        // Masquer le message de bienvenue, afficher les résultats, masquer tendances
        if (welcomeSection) welcomeSection.style.display = 'none';
        if (recommendationsSection) recommendationsSection.style.display = '';
        if (trendingSection) trendingSection.style.display = 'none';
    } else {
        // Afficher le message de bienvenue et tendances, masquer les résultats
        if (welcomeSection) welcomeSection.style.display = '';
        if (recommendationsSection) recommendationsSection.style.display = 'none';
        if (trendingSection) trendingSection.style.display = '';
    }

    if (searchQuery) {
        input.value = searchQuery;
        searchMovies(searchQuery);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query !== '') {
            window.location.href = `home.html?query=${encodeURIComponent(query)}`;
        }
    });

    document.getElementById('login-btn')?.addEventListener('click', () => {
        window.location.href = "login.html";
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

    // Afficher les tendances (top 5 films populaires)
    async function fetchTrendingMovies() {
        // Utilisation de titres populaires pour simuler les tendances (OMDb n'a pas d'endpoint "trending")
        const trendingTitles = [
            "Dune",
            "Oppenheimer",
            "Barbie",
            "John Wick",
            "Spider-Man"
        ];
        const trendingList = document.getElementById('trending-list');
        trendingList.innerHTML = '';
        for (const title of trendingTitles) {
            const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.Response === "True") {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.innerHTML = `
                        <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${data.Title}">
                        <h3>${data.Title} (${data.Year})</h3>
                    `;
                    movieCard.addEventListener('click', () => {
                        window.location.href = `details.html?id=${data.imdbID}`;
                    });
                    trendingList.appendChild(movieCard);
                }
            } catch (error) {
                // Ignore les erreurs individuelles
            }
        }
    }

    // Appelle la fonction au chargement de la page d'accueil
    fetchTrendingMovies();
});

window.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');

    if (loggedIn && username) {
        loginBtn.textContent = 'Déconnexion';
        userProfile.textContent = `Connecté en tant que ${username}`;
        loginBtn.onclick = function () {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
            window.location.reload();
        };
    } else {
        loginBtn.textContent = 'Connexion';
        userProfile.textContent = '';
        loginBtn.onclick = function () {
            window.location.href = 'login.html';
        };
    }
});
