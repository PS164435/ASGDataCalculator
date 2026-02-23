import React, {useEffect, useState} from "react";
import API_URL from "./api";

function Tables() {
    const [selectedCity, setSelectedCity] = useState("Warszawa");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cities = {
        Warszawa: { lat:52.23, lon: 21.01 },
        Kraków: { lat:50.06, lon: 19.94 },
        Gdańsk: { lat:54.35, lon: 18.65 },
        Wrocław: { lat:51.11, lon: 17.03 },
        Poznań: { lat:52.40, lon: 16.93 },
    };

    const fetchWeather = async (cityName) => {
        const {lat,lon} = cities[cityName];
        setLoading2(true);
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=Europe/Warsaw`);
            if (!res.ok) throw new Error("Błąd pobierania danych pogody");
            const data = await res.json();
            setWeather(data.daily);
        } catch (err) {
            console.error(err);
        }
        setLoading2(false);
    };

    useEffect(() => {
        fetchWeather(selectedCity);
    }, [selectedCity]);
    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{color: "red"}}>Error {error}</p>;


    const getWindArrow = (degree) => { 
        const directions = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"];
        const index = Math.round(degree/45)%8;
        return directions[index];
    };
                
    return (
        <div>
            <h2>Pogoda 7dni</h2>

            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                {Object.keys(cities).map((city) => (<option key={city} value={city}>{city}</option>))}
            </select>
                {loading2 && <p>Loading...</p>}
                {weather && (
                    <table border="1" cellPadding="10" style={{marginTop: "1rem" }}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Temp Min</th>
                                <th>Temp Max</th>
                                <th>Opady (mm)</th>
                                <th>Wiatr (km/h)</th>
                                <th>Kierunek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weather.time.map((date,index) => (
                                <tr key={date}>
                                    <td>{date}</td>
                                    <td>{weather.temperature_2m_min[index]}</td>
                                    <td>{weather.temperature_2m_max[index]}</td>
                                    <td>{weather.precipitation_sum[index]}</td>
                                    <td>{weather.windspeed_10m_max[index]}</td>
                                    <td>{getWindArrow(weather.winddirection_10m_dominant[index])}{" "}({weather.winddirection_10m_dominant[index]})</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
        </div>
    );
}


export default Tables;
















