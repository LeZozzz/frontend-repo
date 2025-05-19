window.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');
    // Vérifie si on est sur la page my-space.html, peu importe le dossier
    const isMySpace = window.location.pathname.endsWith('my-space.html');

    // Supprime le bouton s'il existe déjà (évite les doublons)
    let mySpaceBtn = document.getElementById('my-space-btn');
    if (mySpaceBtn) mySpaceBtn.remove();

    if (loginBtn && userProfile) {
        if (loggedIn && username) {
            loginBtn.textContent = 'Déconnexion';
            userProfile.textContent = ''; // <-- Vide le texte utilisateur
            loginBtn.onclick = function () {
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('username');
                window.location.href = 'home.html';
            };

            // Ajoute le bouton "Mon espace" si on n'est PAS déjà sur la page
            if (!isMySpace) {
                mySpaceBtn = document.createElement('button');
                mySpaceBtn.id = 'my-space-btn';
                mySpaceBtn.className = 'btn-primary';
                mySpaceBtn.textContent = 'Mon espace';
                mySpaceBtn.onclick = function () {
                    window.location.href = 'my-space.html';
                };
                loginBtn.parentNode.insertBefore(mySpaceBtn, loginBtn.nextSibling);
            }
        } else {
            loginBtn.textContent = 'Connexion';
            userProfile.textContent = '';
            loginBtn.onclick = function () {
                window.location.href = 'login.html';
            };
        }
    }

    // Affichage des recommandations uniquement sur my-space.html
    if (window.location.pathname.endsWith('my-space.html')) {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId'); // Assure-toi que tu stockes bien l'id utilisateur !
        const nb = 5; // Nombre de recommandations souhaitées

        // Affiche le nom d'utilisateur
        const usernamePlaceholder = document.getElementById('username-placeholder');
        if (usernamePlaceholder) usernamePlaceholder.textContent = username ? username : '';

        async function fetchRecommendations(userId, nb) {
            if (!userId) {
                document.getElementById('recommendations-list').innerHTML = "<p>Connectez-vous pour voir vos recommandations.</p>";
                return;
            }
            const url = `http://localhost:8080/api/recommend?id=${userId}&nb=${nb}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    document.getElementById('recommendations-list').innerHTML = "<p>Erreur lors de la récupération des recommandations.</p>";
                    return;
                }
                const data = await response.json();
                if (data && data.length > 0) {
                    let html = "<h3>Vos recommandations :</h3><div class='movie-list'>";
                    data.forEach(movie => {
                        html += `
                            <div class="movie-card">
                                <img src="${movie.poster || 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.title}">
                                <h4>${movie.title} (${movie.year ? movie.year.toString().substring(0, 4) : ''})</h4>
                            </div>
                        `;
                    });
                    html += "</div>";
                    document.getElementById('recommendations-list').innerHTML = html;
                } else {
                    document.getElementById('recommendations-list').innerHTML = "<p>Aucune recommandation trouvée.</p>";
                }
            } catch (error) {
                document.getElementById('recommendations-list').innerHTML = "<p>Erreur lors de la récupération des recommandations.</p>";
            }
        }

        fetchRecommendations(userId, nb);
    }
});