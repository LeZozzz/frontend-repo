import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [genres, setGenres] = useState([]);

    // Récupère dynamiquement les genres au montage
    useEffect(() => {
        fetch('http://localhost:8080/gender')
            .then(res => res.json())
            .then(data => setGenres(data))
            .catch(() => setGenres([]));
    }, []);

    const handleGenreClick = (genreName) => {
        navigate(`/search?genre=${encodeURIComponent(genreName)}`);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get('searchQuery');
        if (!query) return;
        setLoading(true);
        setError('');
        setResults([]);
        try {
            const res = await fetch(`http://localhost:8080/movie/search/${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Erreur lors de la recherche.");
            const data = await res.json();
            setResults(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="home-hero"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="home-hero-content">
                <h1>
                    Trouve ton <span className="highlight">match ciné parfait</span><br />
                </h1>
                <p className="home-desc">
                    Tape un titre ou un genre et découvre des recommandations personnalisées !
                </p>
                <form className="home-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        name="searchQuery"
                        placeholder="Rechercher un film ou un genre..."
                    />
                    <button type="submit">Découvrir</button>
                </form>
                <div className="home-quicktags">
                    {genres.map(genre => (
                        <span
                            key={genre.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleGenreClick(genre.name)}
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
                <div className="home-results">
                    {loading && <p>Chargement...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {results.length > 0 && (
                        <ul>
                            {results.map(movie => (
                                <li key={movie.id}>
                                    {movie.poster && (
                                        <img src={movie.poster} alt={movie.title} style={{ width: 60, marginRight: 8 }} />
                                    )}
                                    <strong>{movie.title}</strong> {movie.year && `(${movie.year})`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
