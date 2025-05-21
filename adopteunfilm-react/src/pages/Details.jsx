import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Details.css';
import { getUserId, rateMovie } from '../utils/api';
import Rating from '../components/Rating'; // Assuming Rating is a separate component

const formatRuntime = (runtime) => {
    if (!runtime || isNaN(runtime)) return '';
    const minutes = parseInt(runtime, 10);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins} min`;
};

const formatGenre = (genre) => {
    if (!genre) return '';
    return genre.split('|').map(g => g.trim()).join(', ');
};

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = getUserId();
    const isLoggedIn = !!userId;

    useEffect(() => {
        setLoading(true);
        setError('');
        fetch(`http://localhost:8080/movie/${id}`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Erreur lors du chargement des détails.');
                setLoading(false);
            });
    }, [id]);

    const handleRate = async (movieId, rating) => {
        await rateMovie(userId, movieId, rating);
        // Ajoute le film noté dans le localStorage
        let rated = JSON.parse(localStorage.getItem('ratedMovies') || '[]');
        // Empêche les doublons
        if (!rated.find(m => m.id === movieId)) {
            rated.push({ id: movieId, title: movie.title, rating });
            localStorage.setItem('ratedMovies', JSON.stringify(rated));
        }
        // Optionnel : message de confirmation
    };

    if (loading) return (
        <div className="loader-center">
            <div className="loader"></div>
        </div>
    );
    if (error) return <p>{error}</p>;
    if (!movie) return <p>Aucun détail trouvé.</p>;

    return (
        <main>
            <section id="recommendations">
                <div id="movie-details" className="movie-details">
                    <img
                        src={movie.poster || 'https://via.placeholder.com/300x445?text=No+Image'}
                        alt={movie.title}
                    />
                    <div className="movie-info">
                        <h2>
                            {movie.title} {movie.year ? `(${movie.year.toString().substring(0, 4)})` : ''}
                        </h2>
                        <p><strong>Genre :</strong> {formatGenre(movie.genre)}</p>
                        <p><strong>Durée :</strong> {formatRuntime(movie.runtime)}</p>
                        <p><strong>Réalisateur :</strong> {movie.director || ''}</p>
                        <p><strong>Acteurs :</strong> {movie.actors || ''}</p>
                        <p><strong>Résumé :</strong> {movie.plot || movie.description || ''}</p>
                        {isLoggedIn ? (
                            <Rating onRate={rating => handleRate(movie.id, rating)} />
                        ) : (
                            <p>Connectez-vous pour noter ce film.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Details;