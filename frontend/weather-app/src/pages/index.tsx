import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '@/redux/userSlice';
import { getFavorites, addFavoriteCity, removeFavoriteCity, getWeatherData, getCurrentTemperature } from "../../api/auth";
import NavBar from "@/components/NavBar/NavBar";

interface Weather {
    name: string;
    main: {
        temp: number;
    };
    weather: {
        description: string;
    }[];
}

interface ForecastItem {
    dt_txt: string;
    main: {
        temp: number;
    };
    weather: {
        description: string;
    }[];
}

interface Forecast {
    list: ForecastItem[];
}

const Home = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<Weather | null>(null);
    const [forecast, setForecast] = useState<Forecast | null>(null);
    const [favoriteTemperatures, setFavoriteTemperatures] = useState<{ [key: string]: number }>({});
    const favorites = useSelector((state: any) => state.user.favorites);
    const user = useSelector((state: { user: { token: string } }) => state.user.token);
    const dispatch = useDispatch();
  
    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                try {
                    const response = await getFavorites(user);
                    const filteredFavorites = response.filter((city: string) => city.trim() !== "");
                    dispatch(addFavorite(filteredFavorites.filter((city: string) => city)));
                    filteredFavorites.forEach(async (favCity: string) => {
                        const temp = await getCurrentTemperature(favCity, user);
                        setFavoriteTemperatures(prevTemps => ({ ...prevTemps, [favCity]: temp }));
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchFavorites();
    }, [user, dispatch]);

    const filterForecast = (forecastList: any) => {
        const dailyForecast = [];
        const datesSeen = new Set();
    
        for (const item of forecastList) {
            const date = item.dt_txt.split(' ')[0];
            if (!datesSeen.has(date)) {
                datesSeen.add(date);
                dailyForecast.push(item);
            }
        }
        return dailyForecast;
    };

    const handleSearch = async () => {
        try {
            const { weather, forecast } = await getWeatherData(city, user);
            setWeather(weather);
            const filteredForecast = filterForecast(forecast.list);
            setForecast({ ...forecast, list: filteredForecast });
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddFavorite = async () => {
        try {
            await addFavoriteCity({ city, user: user });
            dispatch(addFavorite(city));
        } catch (error) {
            console.log( error);
        }
    };

    const handleRemoveFavorite = async (favCity: string) => {
        try {
            await removeFavoriteCity(favCity, user);
            dispatch(removeFavorite(favCity));
            setFavoriteTemperatures(prevTemps => {
                const { [favCity]: _, ...rest } = prevTemps;
                return rest;
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold text-white mb-8">Weather App</h1>
                {user ? (
                    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                        <div className="flex flex-col mb-4">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter city"
                                className="border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex flex-col space-y-2">
                                <button
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                                <button 
                                    onClick={handleAddFavorite}
                                    className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition"
                                >
                                    Add to Favorites
                                </button>
                            </div>
                        </div>
                        {weather && (
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h2 className="text-xl font-bold mb-2">Current Weather in {weather.name}</h2>
                                <p>Temperature: {weather.main.temp}°C</p>
                                <p>Condition: {weather.weather[0].description}</p>
                            </div>
                        )}
                        {forecast && (
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h2 className="text-xl font-bold mb-2">5 Day Forecast</h2>
                                {forecast.list.map((item, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="font-semibold">{item.dt_txt}</p>
                                        <p>Temperature: {item.main.temp}°C</p>
                                        <p>Condition: {item.weather[0].description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <h2 className="text-xl font-bold mb-2">Favorites</h2>
                        <ul className="list-disc pl-5">
                            {favorites?.map((favCity: string, index: number) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span 
                                        onClick={() => setCity(favCity)} 
                                        className="cursor-pointer text-blue-500 hover:underline"
                                    >
                                        {favCity}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {favoriteTemperatures[favCity] !== undefined ? `${favoriteTemperatures[favCity]}°C` : ''}
                                    </span>
                                    <button 
                                        onClick={() => handleRemoveFavorite(favCity)} 
                                        className="p-1 rounded-lg text-red-500 hover:bg-red-400 duration-300 ease-in-out hover:text-white"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <p className="text-white text-xl">Please log in to see your favorite cities.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;