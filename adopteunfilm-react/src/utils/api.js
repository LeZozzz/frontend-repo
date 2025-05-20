// src/utils/api.js
const API_URL = 'http://localhost:8080/api/recommend';

export const fetchRecommendations = async (userId, nb) => {
    if (!userId) {
        throw new Error("User ID is required to fetch recommendations.");
    }
    console.log("fetchRecommendations:", userId, nb); // Ajoute ceci
    const url = `${API_URL}?id=${userId}&nb=${nb}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error fetching recommendations.");
    }
    const data = await response.json();
    return data;
};

export function getUsername() {
    return localStorage.getItem('username');
}

export function getUserId() {
    return localStorage.getItem('userId');
}

export async function rateMovie(userId, movieId, rating) {
    const url = 'http://localhost:8080/api/rating/cache';
    const body = {
        id: `${userId}${movieId}`, // ou une autre logique pour générer un id unique
        rate: rating,
        accountId: Number(userId),
        movieId: Number(movieId)
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error("Error rating movie.");
    }
    return response.json();
}