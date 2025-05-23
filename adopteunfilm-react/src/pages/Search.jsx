import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Search.css'; // Assure-toi que le chemin est correct


const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const genre = params.get('genre') || '';

    useEffect(() => {
        if (query) {
            setLoading(true);
            setError('');
            fetch(`http://localhost:8080/movie/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data || []);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Une erreur est survenue.');
                    setLoading(false);
                });
        } else if (genre) {
            setLoading(true);
            setError('');
            fetch(`http://localhost:8080/movie/genre/${encodeURIComponent(genre)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data || []);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Une erreur est survenue.');
                    setLoading(false);
                });
        }
    }, [query, genre]);

    return (
        <div className="search-results">
            {loading ? (
                <div className="loader-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <h2 id="search-result-title">
                        {query ? `Résultats trouvés pour : "${query}"` : 'Recherche'}
                    </h2>
                    {error && <p>{error}</p>}
                    <div id="movie-list">
                        {results.length > 0 ? results.map(movie => (
                            <div
                                key={movie.id}
                                className="movie-card"
                                onClick={() => navigate(`/details/${movie.id}`)}
                            >
                                <img
                                    src={movie.poster || 'https://via.placeholder.com/300x445?text=No+Image'}
                                    alt={movie.title}
                                />
                                <h3>
                                    {movie.title} {movie.year ? `(${movie.year.toString().substring(0, 4)})` : ''}
                                </h3>
                            </div>
                        )) : !error && <p>Aucun film trouvé avec ce titre.</p>}
                    </div>
                </>
            )}
        </div>
    );
};

export default Search;