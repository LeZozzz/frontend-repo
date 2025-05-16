document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    login(username, password, errorDiv);
});

async function login(username, password, errorDiv) {
    const url = 'http://localhost:8080/account/login';
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        if (!response.ok) {
            showError("Identifiants incorrects !", errorDiv);
            return;
        }
        // Si la réponse est un JSON avec id, nom, prenom :
        const data = await response.json();
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.prenom + ' ' + data.nom); // <-- AJOUT
        window.location.href = 'home.html';
    } catch (error) {
        showError("Erreur lors de la connexion.", errorDiv);
    }
}

function showError(message, errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.background = '#ffdddd';
    errorDiv.style.color = '#b30000';
    errorDiv.style.border = '1px solid #b30000';
    errorDiv.style.animation = 'shake 0.3s';
    // Animation CSS
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }`;
        document.head.appendChild(style);
    }
    // Supprime l'animation après pour pouvoir la rejouer
    setTimeout(() => {
        errorDiv.style.animation = '';
    }, 400);
}