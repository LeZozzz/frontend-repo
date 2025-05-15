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
});