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
                console.log(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Erreur lors du chargement des détails.');
                setLoading(false);
            });
    }, [id]);

    const handleRate = async (movie, rating) => {
        if (!userId) return;
        try {
            await fetch(`http://localhost:8080/account/${userId}/movie/${movie.id}/${rating}/rating`, {
                method: 'POST'
            });
            // Optionnel : afficher un message de succès ou rafraîchir la note
            alert('Votre note a bien été prise en compte !');
        } catch (e) {
            alert('Erreur lors de la prise en compte de la note.');
        }
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
                        <p><strong>Genre :</strong> {
                            Array.isArray(movie.genders)
                                ? movie.genders.join(', ')
                                : (movie.genders ? movie.genders.split('|').join(', ') : '')
                        }</p>
                        <p><strong>Durée :</strong> {formatRuntime(movie.runtime)}</p>
                        <p><strong>Réalisateur :</strong> {movie.director || ''}</p>
                        <p><strong>Acteurs :</strong> {
                            Array.isArray(movie.actors)
                                ? movie.actors.join(', ')
                                : (movie.actors ? movie.actors.split('|').join(', ') : '')
                        }</p>
                        <p><strong>Résumé :</strong> {movie.plot || movie.description || ''}</p>
                        {isLoggedIn ? (
                            <Rating onRate={rating => handleRate(movie, rating)} />
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