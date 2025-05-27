import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/adopteunfilm_rose.png';
import logotitre from '../assets/logotitre_rose.png';
import { motion } from 'framer-motion';
import '../styles/Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

    useEffect(() => {
        // Met à jour l'état si le localStorage change (optionnel)
        const onStorage = () => {
            setIsLoggedIn(localStorage.getItem('loggedIn') === 'true');
            setUserRole(localStorage.getItem('userRole'));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleMySpace = () => {
        navigate('/my-space');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearch('');
        }
    };

    return (
        <motion.header
            className="header-container"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="logo-wrapper">
                <a href="/">
                    <img src={logo} alt="Logo" className="logo" />
                </a>
                <a href="/">
                    <img src={logotitre} alt="Titre" className="logo-second" />
                </a>
            </div>

            <form id="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    id="search-input"
                    placeholder="Rechercher un film..."
                    autoComplete="off"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-glow">Rechercher</button>
            </form>

            <div className="header-actions">
                {isLoggedIn ? (
                    <>
                        {userRole === 'ADMIN' ? (
                            <button className="btn-glow" onClick={() => navigate('/admin')} style={{ marginRight: '1rem' }}>
                                Espace administrateur
                            </button>
                        ) : (
                            <button className="btn-glow" onClick={handleMySpace} style={{ marginRight: '1rem' }}>
                                Mon espace
                            </button>
                        )}
                        <button className="btn-glow logout-btn" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <button className="btn-glow logout-btn" onClick={handleLogin}>
                        Connexion
                    </button>
                )}
            </div>
        </motion.header>
    );
};

export default Header;
