// Exemple de données utilisateur (à remplacer par une vraie API plus tard)
const mockUser = {
    username: "JeanDupont",
    email: "jean.dupont@email.com"
};

// Fonction pour afficher le profil utilisateur
export function renderUserProfile(containerId = "user-profile") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <h2>Mon Profil</h2>
        <p><strong>Nom d'utilisateur :</strong> ${mockUser.username}</p>
        <p><strong>Email :</strong> ${mockUser.email}</p>
        <button id="logout-btn">Se déconnecter</button>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
        // Ici tu peux ajouter la logique de déconnexion
        alert("Déconnexion !");
        // Rediriger vers la page de connexion, par exemple :
        window.location.href = "login.html";
    });

}