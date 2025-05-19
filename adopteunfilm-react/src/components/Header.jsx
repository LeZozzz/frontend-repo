import React from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../../public/assets/adopteunfilm.png';
import logotitre from '../../public/assets/logotitre.png';

const Header = () => {
    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        history.push('/'); // Redirige vers la page d'accueil après déconnexion
    };

    return (
        <header>
            <div className="header-container">
                <a href="/home">
                    <img src={logo} alt="Logo" className="logo" />
                </a>
                <a href="/home">
                    <img src={logotitre} alt="Deuxième Logo" className="logo logo-second" />
                </a>
            </div>
            <form id="search-form">
                <input type="text" id="search-input" placeholder="Rechercher un film..." autoComplete="off" />
                <button type="submit">Rechercher</button>
            </form>
            <div className="header-actions">
                <button id="login-btn" className="btn-primary" onClick={handleLogout}>Déconnexion</button>
                <div id="user-profile"></div>
            </div>
        </header>
    );
};

export default Header;