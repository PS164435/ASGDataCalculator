import React, {useEffect, useState} from "react";

function Tables() {
    const [replicas, setReplicas] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [ammunition, setAmmunition] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const [replicasRes, attachmentsRes, ammunitionRes] = await Promise.all([
                fetch("http://127.0.0.1:8000/api/replicas/"),
                fetch("http://127.0.0.1:8000/api/attachments/"),
                fetch("http://127.0.0.1:8000/api/ammunition/"),
            ]);

            if (!replicasRes.ok || !attachmentsRes.ok || !ammunitionRes.ok) {
                throw new Error("API connection Error");
            }

            const [replicasData, attachmentsData, ammunitionData] = await Promise.all([
                replicasRes.json(),
                attachmentsRes.json(),
                ammunitionRes.json(),
            ]);

            setReplicas(replicasData);
            setAttachments(attachmentsData);
            setAmmunition(ammunitionData);
            setLoading(false);
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{color: "red"}}>Error {error}</p>;

    return (
        <div>
            <h1>ASG Database</h1>
            <h2>Repliki</h2>
            {replicas.length === 0 ? (
                <p>Brak danych.</p>
            ) : (
                <table border="1" cellPadding="10" style={{borderCollapse: "collapse", marginBottom: "2rem"}}>
                    <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Kategoria</th>
                        <th>Rozmiar</th>
                        <th>Waga</th>
                        <th>Opis</th>
                    </tr>
                    </thead>
                    <tbody>
                    {replicas.map((r) => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.category}</td>
                            <td>{r.size}</td>
                            <td>{r.weight}</td>
                            <td>{r.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <h2>Dodatki</h2>
            {attachments.length === 0 ? (
                <p>Brak danych.</p>
            ) : (
                <table border="1" cellPadding="10" style={{borderCollapse: "collapse", marginBottom: "2rem"}}>
                    <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Firma</th>
                        <th>Kategoria</th>
                        <th>Rozmiar</th>
                        <th>Waga</th>
                        <th>Opis</th>
                    </tr>
                    </thead>
                    <tbody>
                    {attachments.map((r) => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.company}</td>
                            <td>{r.category}</td>
                            <td>{r.size}</td>
                            <td>{r.weight}</td>
                            <td>{r.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <h2>Amunicja</h2>
            {ammunition.length === 0 ? (
                <p>Brak danych.</p>
            ) : (
                <table border="1" cellPadding="10" style={{borderCollapse: "collapse", marginBottom: "2rem"}}>
                    <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Firma</th>
                        <th>Waga</th>
                        <th>Ilość</th>
                        <th>Biodegradowalne</th>
                        <th>Świecąca</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ammunition.map((r) => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.company}</td>
                            <td>{r.weight}</td>
                            <td>{r.amount}</td>
                            <td>{r.biodegradable ? "YES" : "NO"}</td>
                            <td>{r.glowing ? "YES" : "NO"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Tables;