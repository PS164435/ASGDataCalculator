import React, {useEffect, useState, useCallback} from "react";

const cities = {
    Białystok: { lat:53.1333, lon: 23.1643 },
    Bydgoszcz: { lat:53.1235, lon: 18.0076 },
    Gdańsk: { lat:54.3523, lon: 18.6491 },
    Gorzów_Wielkopolski: { lat:52.7368, lon: 15.2288 },
    Katowice: { lat:50.2584, lon: 19.0275 },
    Kielce: { lat:50.8703, lon: 20.6275 },
    Kraków: { lat:50.0614, lon: 19.9366 },
    Lublin: { lat:51.25, lon: 22.5667 },
    Łódź: { lat:51.7706, lon: 19.4739 },
    Olsztyn: { lat:53.7799, lon: 20.4942 },
    Opole: { lat:50.6721, lon: 17.9253 },
    Poznań: { lat:52.4069, lon: 16.9299 },
    Rzeszów: { lat:50.0413, lon: 21.999 },
    Szczecin: { lat:53.4289, lon: 14.553 },
    Toruń: { lat:53.0138, lon: 18.5981 },
    Warszawa: { lat:52.2298, lon: 21.0118 },
    Wrocław: { lat:51.1, lon: 17.0333 },
    Zielona_Góra: { lat:51.9355, lon: 15.5064 },
};    

function Tables() {
    const [selectedCity, setSelectedCity] = useState("Warszawa");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (cityName) => {
        const {lat,lon} = cities[cityName];
        setLoading(true);
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=Europe/Warsaw`);
            if (!res.ok) throw new Error("Błąd pobierania danych pogody");
            const data = await res.json();
            setWeather(data.daily);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData(selectedCity);
    }, [selectedCity, fetchData]);

    if (loading) return <p>Loading...</p>;

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
                {loading && <p>Loading...</p>}
                {weather && (
                    <table>
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























