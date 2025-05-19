document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');

    // Si on arrive avec une requête dans l'URL (depuis details.html)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const welcomeSection = document.getElementById('welcome-section');
    const recommendationsSection = document.getElementById('recommendations');

    if (searchQuery && searchQuery.trim() !== "") {
        if (welcomeSection) welcomeSection.style.display = 'none';
        if (recommendationsSection) recommendationsSection.style.display = '';
    } else {
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
            window.location.href = `home.html?query=${encodeURIComponent(query)}`;
        }
    });

    document.getElementById('login-btn')?.addEventListener('click', () => {
        window.location.href = "login.html";
    });

    async function searchMovies(query) {
        // Utilise le bon endpoint pour la recherche par titre
        const url = `http://localhost:8080/movie/title/${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                document.getElementById('search-result-title').textContent = `Résultats trouvés pour : "${query}"`;
                movieList.innerHTML = '';
                data.forEach((movie) => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.innerHTML = `
                        <img src="${movie.poster || 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.title}">
                        <h3>${movie.title} (${movie.year ? movie.year.toString().substring(0, 4) : ''})</h3>
                    `;
                    movieCard.addEventListener('click', () => {
                        window.location.href = `details.html?id=${movie.id}`;
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

window.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const movieList = document.getElementById('movie-list');
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const trendingSection = document.getElementById('trending-section');
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const welcomeSection = document.getElementById('welcome-section');
    const recommendationsSection = document.getElementById('recommendations');

    // Gestion du bouton connexion/déconnexion
    if (loginBtn && userProfile) {
        if (loggedIn && username) {
            loginBtn.textContent = 'Déconnexion';
            userProfile.textContent = `Connecté en tant que ${username}`;
            loginBtn.onclick = function () {
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                // Si on est sur my-space.html, on redirige vers home.html
                if (window.location.pathname.endsWith('my-space.html')) {
                    window.location.href = 'home.html';
                } else {
                    window.location.reload();
                }
            };
        } else {
            loginBtn.textContent = 'Connexion';
            userProfile.textContent = '';
            loginBtn.onclick = function () {
                window.location.href = 'login.html';
            };
        }
    }

    // Affichage/masquage des sections selon la recherche
    if (searchQuery && searchQuery.trim() !== "") {
        if (trendingSection) trendingSection.style.display = 'none';
        // ...masquer d'autres sections si besoin...
    } else {
        if (trendingSection) trendingSection.style.display = '';
    }

    // Affichage sections selon la recherche
    if (searchQuery && searchQuery.trim() !== "") {
        if (welcomeSection) welcomeSection.style.display = 'none';
        if (recommendationsSection) recommendationsSection.style.display = '';
    } else {
        if (welcomeSection) welcomeSection.style.display = '';
        if (recommendationsSection) recommendationsSection.style.display = 'none';
    }

    if (searchQuery) {
        input.value = searchQuery;
        searchMovies(searchQuery);
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query !== '') {
            window.location.href = `home.html?query=${encodeURIComponent(query)}`;
        }
    });

    async function searchMovies(query) {
        const url = `http://localhost:8080/movie/title/${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                document.getElementById('search-result-title').textContent = `Résultats trouvés pour : "${query}"`;
                movieList.innerHTML = '';
                data.forEach((movie) => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.innerHTML = `
                        <img src="${movie.poster || 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.title}">
                        <h3>${movie.title} (${movie.year ? movie.year.toString().substring(0, 4) : ''})</h3>
                    `;
                    movieCard.addEventListener('click', () => {
                        window.location.href = `details.html?id=${movie.id}`;
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
