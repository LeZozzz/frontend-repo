import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logotitre from '../assets/logotitre_rose.png';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        setError('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8080/account/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!response.ok) {
                setError('Identifiants incorrects !');
                return;
            }

            const data = await response.json();
            localStorage.setItem('userRole', data.role); // data.role doit valoir 'ADMIN' ou 'USER'
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', data.nom);
            if (data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/my-space'); // Redirige vers MySpace
            }
        } catch (err) {
            setError('Erreur lors de la connexion.');
        }
    };

    return (
        <motion.main
            className="login-main"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <motion.form
                className="login-form neon-glow"
                autoComplete="off"
                onSubmit={handleSubmit}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <a href="/">
                    <img src={logotitre} alt="Logo AdopteUnFilm" className="login-logo" />
                </a>
                <label htmlFor="username-input">Nom d'utilisateur</label>
                <input
                    type="text"
                    id="username-input"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="btn-glow">Se connecter</button>
            </motion.form>
        </motion.main>
    );
};

export default Login;
