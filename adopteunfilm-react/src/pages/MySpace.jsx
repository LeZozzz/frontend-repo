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
        // Récupère les films notés depuis le localStorage
        const rated = JSON.parse(localStorage.getItem('ratedMovies') || '[]');
        setSeenMovies(rated);
    }, []);

    const handleRate = async (movieId, rating) => {
        await rateMovie(userId, movieId, rating);
        const ratedMovie = recommendations.find(m => m.id === movieId);
        setRecommendations(recommendations.filter(m => m.id !== movieId));
        setSeenMovies([...seenMovies, { ...ratedMovie, rating }]);
        // Ajoute dans le localStorage
        let rated = JSON.parse(localStorage.getItem('ratedMovies') || '[]');
        if (!rated.find(m => m.id === movieId)) {
            rated.push({ id: movieId, title: ratedMovie.title, rating });
            localStorage.setItem('ratedMovies', JSON.stringify(rated));
        }
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
                <h3>Mes notes</h3>
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