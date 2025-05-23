import React, { useEffect, useState, useRef } from 'react';
import { getUserId, getUsername, fetchRecommendations, rateMovie, getMovie } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/MySpace.css';

const MySpace = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [seenMovies, setSeenMovies] = useState([]);
    const [showArrows, setShowArrows] = useState(false);
    const [showNotesArrows, setShowNotesArrows] = useState(false);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const notesCarouselRef = useRef(null);
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

    useEffect(() => {
        // Vérifie si le carrousel déborde pour les notes
        const carousel = notesCarouselRef.current;
        if (carousel) {
            setShowNotesArrows(carousel.scrollWidth > carousel.clientWidth);
        }
    }, [seenMovies]);

    useEffect(() => {
        const updateSeenMovies = () => {
            const rated = JSON.parse(localStorage.getItem('ratedMovies') || '[]');
            setSeenMovies(rated);
        };
        window.addEventListener('storage', updateSeenMovies);
        // Appel initial
        updateSeenMovies();
        return () => window.removeEventListener('storage', updateSeenMovies);
    }, []);

    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:8080/rating/account/${userId}`)
            .then(res => res.json())
            .then(async data => {
                const ratingsWithMovie = await Promise.all(
                    (data || []).map(async rating => {
                        // On suppose que rating.movie contient l'id du film
                        if (rating.movie && typeof rating.movie === 'object' && rating.movie.poster) {
                            // Si jamais le backend renvoie l'objet complet
                            return { ...rating, movie: rating.movie };
                        }
                        if (rating.movie) {
                            try {
                                const movie = await getMovie(rating.movie);
                                return { ...rating, movie };
                            } catch (e) {
                                return rating;
                            }
                        }
                        return rating;
                    })
                );
                setSeenMovies(ratingsWithMovie);
            });
    }, [userId]);

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

    const scrollNotesCarousel = (direction) => {
        const carousel = document.getElementById('carousel-notes');
        const item = carousel?.querySelector('.noted-movie-card');
        if (!carousel || !item) return;

        const itemWidth = item.offsetWidth + parseFloat(getComputedStyle(carousel).gap || 16);
        carousel.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
    };

    return (
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
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate(`/details/${movie.id}`)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate(`/details/${movie.id}`);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                                aria-label={`Voir les détails de ${movie.title}`}
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
                <div className="carousel-wrapper">
                    {showNotesArrows && (
                        <button className="carousel-arrow left" onClick={() => scrollNotesCarousel(-1)}>&lt;</button>
                    )}
                    <div
                        className="carousel"
                        id="carousel-notes"
                        ref={notesCarouselRef}
                    >
                        {seenMovies.length === 0 ? (
                            <p style={{ margin: 0 }}>Aucun film noté pour l’instant.</p>
                        ) : (
                            seenMovies.map((rating, idx) => {
                                const movie = rating.movie || {};
                                return (
                                    <div className="noted-movie-card" key={movie.id || idx}>
                                        <img
                                            src={movie.poster || 'https://via.placeholder.com/120x180?text=No+Image'}
                                            alt={movie.title || ''}
                                            className="noted-movie-poster"
                                        />
                                        <div className="noted-movie-title">{movie.title || ''}</div>
                                        <div className="noted-movie-stars">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className="noted-movie-star">
                                                    {(rating.rate || rating.rating) > i ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="noted-movie-rating">{rating.rate || rating.rating} / 5</div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {showNotesArrows && (
                        <button className="carousel-arrow right" onClick={() => scrollNotesCarousel(1)}>&gt;</button>
                    )}
                </div>
            </section>
        </main >
    );
};

export default MySpace;