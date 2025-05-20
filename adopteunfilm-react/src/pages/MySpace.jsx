import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecommendationsList from '../components/RecommendationsList';
import { getUserId, getUsername } from '../utils/api';

const MySpace = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUsername = getUsername();
        const storedUserId = getUserId();
        setUsername(storedUsername);
        setUserId(storedUserId);
    }, []);

    return (
        <div>
            <main>
                <section id="user-welcome">
                    <h2>Bienvenue dans votre espace, <span>{username}</span> !</h2>
                    <RecommendationsList userId={userId} />
                </section>
            </main>
        </div>
    );
};

export default MySpace;