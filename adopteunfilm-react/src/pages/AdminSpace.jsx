import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/api';
import '../styles/AdminSpace.css';


const AdminSpace = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('films');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = getUserId();
        if (!userId) {
            navigate('/'); // Redirige si non connecté
            return;
        }
        // Appel à l'API pour récupérer l'état du compte
        fetch(`http://localhost:8080/account/${userId}`)
            .then(res => res.json())
            .then(data => {
                setIsAdmin(data.role === 'ADMIN'); // <-- ici, c'est bien 'role'
                setLoading(false);
            })
            .catch(() => {
                setIsAdmin(false);
                setLoading(false);
            });
    }, [navigate]);

    if (loading) return <div>Chargement...</div>;
    if (!isAdmin) return <div>Accès refusé : vous n'êtes pas administrateur.</div>;

    return (
        <main>
            <h1>Espace Administrateur</h1>
            <div className="admin-tabs">
                <button
                    className={tab === 'films' ? 'active' : ''}
                    onClick={() => setTab('films')}
                >
                    Gérer les films
                </button>
                <button
                    className={tab === 'users' ? 'active' : ''}
                    onClick={() => setTab('users')}
                >
                    Gérer les utilisateurs
                </button>
                <button
                    className={tab === 'ratings' ? 'active' : ''}
                    onClick={() => setTab('ratings')}
                >
                    Gérer les recommandations
                </button>
            </div>
            <div className="admin-content">
                {tab === 'films' && <FilmsAdmin />}
                {tab === 'users' && <UsersAdmin />}
                {tab === 'ratings' && <RatingsAdmin />}
            </div>
        </main>
    );
};

const FilmsAdmin = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);
        try {
            const res = await fetch(`http://localhost:8080/movie/search?q=${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error("Erreur lors de la recherche.");
            const data = await res.json();
            setResults(data || []);
        } catch {
            setError("Erreur lors de la recherche.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (movieId) => {
        if (!window.confirm("Supprimer ce film ?")) return;
        try {
            const res = await fetch(`http://localhost:8080/movie/${movieId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error();
            setResults(results.filter(m => m.id !== movieId));
        } catch {
            setError("Erreur lors de la suppression.");
        }
    };

    return (
        <div>
            <h2>Gestion des films</h2>
            <form className="admin-film-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Rechercher un film par nom..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-glow">Rechercher</button>
            </form>
            {loading && <p>Chargement...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className="admin-film-list">
                {results.map(movie => (
                    <li key={movie.id} className="admin-film-item">
                        <span className="admin-film-title">{movie.title} {movie.year && `(${movie.year})`}</span>
                        <button
                            className="btn-glow admin-film-delete"
                            onClick={() => handleDelete(movie.id)}
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const UsersAdmin = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);
        try {
            const res = await fetch(`http://localhost:8080/account/username/${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error("Erreur lors de la recherche.");
            const data = await res.json();
            // Si ton endpoint retourne un seul utilisateur, mets-le dans un tableau
            setResults(Array.isArray(data) ? data : data ? [data] : []);
        } catch {
            setError("Erreur lors de la recherche.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Supprimer ce compte utilisateur ?")) return;
        try {
            const res = await fetch(`http://localhost:8080/account/${userId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error();
            setResults(results.filter(u => u.id !== userId));
        } catch {
            setError("Erreur lors de la suppression.");
        }
    };

    return (
        <div>
            <h2>Gestion des utilisateurs</h2>
            <form className="admin-film-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur par nom..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-glow">Rechercher</button>
            </form>
            {loading && <p>Chargement...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className="admin-film-list">
                {results.map(user => (
                    <li key={user.id} className="admin-film-item">
                        <span className="admin-film-title">{user.nom} {user.prenom} ({user.email})</span>
                        <button
                            className="btn-glow admin-film-delete"
                            onClick={() => handleDelete(user.id)}
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const RatingsAdmin = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);
        try {
            // 1. Récupère l'utilisateur par username
            const userRes = await fetch(`http://localhost:8080/account/username/${encodeURIComponent(search)}`);
            if (!userRes.ok) throw new Error("Utilisateur non trouvé.");
            const userData = await userRes.json();
            const userId = userData.id;
            if (!userId) throw new Error("Utilisateur non trouvé.");

            // 2. Récupère les ratings par userId
            const ratingsRes = await fetch(`http://localhost:8080/rating/account/${userId}`);
            if (!ratingsRes.ok) throw new Error("Erreur lors de la récupération des recommandations.");
            const ratingsData = await ratingsRes.json();
            setResults(Array.isArray(ratingsData) ? ratingsData : []);
        } catch (err) {
            setError(err.message || "Erreur lors de la recherche.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ratingId) => {
        if (!window.confirm("Supprimer cette recommandation ?")) return;
        try {
            const res = await fetch(`http://localhost:8080/rating/${ratingId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error();
            setResults(results.filter(r => r.id !== ratingId));
        } catch {
            setError("Erreur lors de la suppression.");
        }
    };

    return (
        <div>
            <h2>Gestion des recommandations</h2>
            <form className="admin-film-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Rechercher les recommandations d'un utilisateur (username)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-glow">Rechercher</button>
            </form>
            {loading && <p>Chargement...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className="admin-film-list">
                {results.map(rating => (
                    <li key={rating.id} className="admin-film-item">
                        <span className="admin-film-title">
                            Film : {rating.movieTitle || rating.movie?.title || rating.movieId} — Note : {rating.rate || rating.rating}
                        </span>
                        <button
                            className="btn-glow admin-film-delete"
                            onClick={() => handleDelete(rating.id)}
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSpace;