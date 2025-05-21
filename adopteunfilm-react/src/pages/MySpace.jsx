import React, { useEffect, useState, useRef } from 'react';
import { getUserId, getUsername, fetchRecommendations, rateMovie } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/MySpace.css';

const MySpace = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [seenMovies, setSeenMovies] = useState([]);
    const [showArrows, setShowArrows] = useState(false);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const storedUsername = getUsername();
        const storedUserId = getUserId();
        setUsername(storedUsername);
        setUserId(storedUserId);

        if (storedUserId) {
            fetchRecommendations(storedUserId, 10).then(recos => {
                setRecommendations(recos);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
        // Récupère les films notés depuis le localStorage
        const rated = JSON.parse(localStorage.getItem('ratedMovies') || '[]');
        setSeenMovies(rated);
    }, []);

    useEffect(() => {
        // Vérifie si le carrousel déborde
        const carousel = carouselRef.current;
        if (carousel) {
            setShowArrows(carousel.scrollWidth > carousel.clientWidth);
        }
    }, [recommendations]);

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

    const scrollCarousel = (direction) => {
        const carousel = document.getElementById('carousel-reco');
        const item = carousel.querySelector('.carousel-item');
        if (!carousel || !item) return;

        const itemWidth = item.offsetWidth + parseFloat(getComputedStyle(carousel).gap || 16); // carte + espace
        carousel.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
    };

    return (
        <>
            {loading ? (
                <div className="loader-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <main>
                    <section id="user-welcome">
                        <h2>Bienvenue dans votre espace, <span>{username}</span> !</h2>
                    </section>
                    <section>
                        <h3>Mes recommandations</h3>
                        <div className="carousel-wrapper">
                            {showArrows && (
                                <button className="carousel-arrow left" onClick={() => scrollCarousel(-1)}>&lt;</button>
                            )}
                            <div className="carousel" id="carousel-reco" ref={carouselRef}>
                                {recommendations.map(movie => (
                                    <div
                                        className="carousel-item"
                                        key={movie.id}
                                        onClick={() => navigate(`/details/${movie.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={movie.poster} alt={movie.title} className="carousel-img" />
                                        <div className="carousel-title">{movie.title}</div>
                                    </div>
                                ))}
                            </div>
                            {showArrows && (
                                <button className="carousel-arrow right" onClick={() => scrollCarousel(1)}>&gt;</button>
                            )}
                        </div>
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
            )}
        </>
    );
};

export default MySpace;