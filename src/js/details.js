document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    const API_KEY = '538568d7'; // Remplace avec ta clé valide
    const container = document.getElementById('movie-details');

    if (!movieId) {
        container.innerHTML = '<p>ID du film non fourni.</p>';
        return;
    }

    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`);
        const data = await res.json();

        if (data.Response === "True") {
            container.innerHTML = `
                <div class="movie-card">
                    <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${data.Title}">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>Durée:</strong> ${data.Runtime}</p>
                    <p><strong>Réalisateur:</strong> ${data.Director}</p>
                    <p><strong>Acteurs:</strong> ${data.Actors}</p>
                    <p><strong>Synopsis:</strong> ${data.Plot}</p>
                    <p><strong>Note IMDB:</strong> ${data.imdbRating}</p>
                </div>
            `;
        } else {
            container.innerHTML = `<p>Film non trouvé.</p>`;
        }
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p>Erreur lors de la récupération des données.</p>`;
    }
});
