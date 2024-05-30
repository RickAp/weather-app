import axios from "axios";

interface RegisterUser {
    username: string;
    email: string;
    password: string;
}

interface LogInUser {
    email: string;
    password: string;
}

interface AddFavoriteCities {
    city: string;
    user: string;
}

const API = "http://127.0.0.1:4000/api";

export const registerRequest = (user: RegisterUser) => axios.post(`${API}/register`, user);

export const loginRequest = (user: LogInUser) => axios.post(`${API}/login`, user);

export const getFavorites = async (token: string) => {
    const response = await axios.get(`${API}/favorites`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.map((favorite: any) => favorite.city);
};

export const addFavoriteCity = async ({ city, user }: AddFavoriteCities) => {
    return axios.post(`${API}/favorites`, { city }, {
        headers: {
            Authorization: `Bearer ${user}`,
        },
    });
};

export const removeFavoriteCity = async (city: string, user: string) => {
    return axios.delete(`${API}/favorites/${city}`, {
        headers: {
            Authorization: `Bearer ${user}`,
        },
    });
};

export const getWeatherData = async (city: string, user: string) => {
    const weatherResponse = await axios.get(`${API}/weather/current/${city}`, {
        headers: {
            Authorization: `Bearer ${user}`,
        },
    });
    
    const forecastResponse = await axios.get(`${API}/weather/forecast/${city}`, {
        headers: {
            Authorization: `Bearer ${user}`,
        },
    });
    
    return {
        weather: weatherResponse.data,
        forecast: forecastResponse.data,
    };
};

export const getCurrentTemperature = async (city: string, user: string) => {
    const response = await axios.get(`${API}/weather/current/${city}`, {
        headers: {
            Authorization: `Bearer ${user}`,
        },
    });
    return response.data.main.temp;
};

