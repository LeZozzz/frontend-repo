// src/utils/api.js
const API_URL = 'http://localhost:8080/api/recommend';

export const fetchRecommendations = async (userId, nb) => {
    if (!userId) {
        throw new Error("User ID is required to fetch recommendations.");
    }
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