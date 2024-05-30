import Favorite from "../models/favorite.model.js";
import axios from "axios";
import { TOKEN_SECRET } from "../config.js";

const API_KEY = "420152a0b49071f4e47adcf743ecdb7c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const addFavorite = async (req, res) => {
    const { city } = req.body;
    const userId = req.user.id;

    try {
        const favorite = new Favorite({ userId, city });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    const { city } = req.params;
    const userId = req.user.id;

    try {
        await Favorite.findOneAndDelete({ userId, city });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    const userId = req.user.id;

    try {
        const favorites = await Favorite.find({ userId });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCurrentWeather = async (req, res) => {
    const { city } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFiveDayForecast = async (req, res) => {
    const { city } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};