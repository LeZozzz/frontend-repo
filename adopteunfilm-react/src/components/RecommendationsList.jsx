import React, { useEffect, useState } from 'react';
import { fetchRecommendations } from '../utils/api';
import MovieCard from './MovieCard';

const RecommendationsList = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    const nb = 6; // Nombre de recommandations à afficher

    useEffect(() => {
        const getRecommendations = async () => {
            if (!userId) {
                setError("Connectez-vous pour voir vos recommandations.");
                setLoading(false);
                return;
            }
            try {
                const data = await fetchRecommendations(userId, nb);
                setRecommendations(data);
            } catch (err) {
                setError("Erreur lors de la récupération des recommandations.");
            } finally {
                setLoading(false);
            }
        };

        getRecommendations();
    }, [userId, nb]);

    if (loading) {
        return <p>Chargement des recommandations...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='movie-grid'>
            {recommendations.length > 0 ? (
                recommendations.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))
            ) : (
                <p>Aucune recommandation trouvée.</p>
            )}
        </div>
    );
};

export default RecommendationsList;