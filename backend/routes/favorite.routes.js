import { Router } from "express"
import { addFavorite, removeFavorite, getFavorites, getCurrentWeather, getFiveDayForecast } from "../controllers/favorite.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/favorites", authRequired, addFavorite);
router.delete("/favorites/:city", authRequired, removeFavorite);
router.get("/favorites", authRequired, getFavorites);
router.get("/weather/current/:city", authRequired, getCurrentWeather);
router.get("/weather/forecast/:city", authRequired, getFiveDayForecast);

export default router;