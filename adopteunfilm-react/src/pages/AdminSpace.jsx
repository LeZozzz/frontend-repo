import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/api';

const AdminSpace = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
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
            {/* Ici tu pourras ajouter des boutons ou composants pour gérer la BD */}
            <p>Bienvenue, vous êtes connecté en tant qu'administrateur.</p>
            {/* Exemples à ajouter plus tard :
                - Gestion des utilisateurs
                - Ajout/suppression de films
                - Visualisation des logs, etc.
            */}
        </main>
    );
};

export default AdminSpace;