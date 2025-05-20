import React, { useEffect, useState } from 'react';
import { getUserId, getUsername, fetchRecommendations, rateMovie } from '../utils/api';
import '../styles/MySpace.css';
import Rating from '../components/Rating';

const MySpace = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [seenMovies, setSeenMovies] = useState([]);

    useEffect(() => {
        const storedUsername = getUsername();
        const storedUserId = getUserId();
        setUsername(storedUsername);
        setUserId(storedUserId);

        if (storedUserId) {
            fetchRecommendations(storedUserId, 10).then(setRecommendations);
        }
    }, []);

    const handleRate = async (movieId, rating) => {
        await rateMovie(userId, movieId, rating);
        const ratedMovie = recommendations.find(m => m.id === movieId);
        setRecommendations(recommendations.filter(m => m.id !== movieId));
        setSeenMovies([...seenMovies, { ...ratedMovie, rating }]);
    };

    return (
        <main>
            <section id="user-welcome">
                <h2>Bienvenue dans votre espace, <span>{username}</span> !</h2>
            </section>
            <section>
                <h3>Mes recommandations</h3>
                <ul>
                    {recommendations.map(movie => (
                        <li key={movie.id}>
                            {movie.title}
                            <Rating onRate={rating => handleRate(movie.id, rating)} />
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h3>Mes films</h3>
                <ul>
                    {seenMovies.map(movie => (
                        <li key={movie.id}>
                            {movie.title} (Note : {movie.rating})
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
};

export default MySpace;