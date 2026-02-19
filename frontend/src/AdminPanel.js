import React, {useEffect, useState} from "react";
import API_URL from "./api";

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [savedCalculators, setSavedCalculators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteUser = async (id) => {
        const token = localStorage.getItem("access");
        if (!window.confirm("Czy na pewno?")) return;

        try {
            const res = await fetch(`${API_URL}/accounts/users/${id}/`, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`,},
            });
            if (!res.ok) throw new Error();

            setUsers (prev => prev.filter(i => i.email !== email));
        } catch {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const deleteCalculator = async (id) => {
        const token = localStorage.getItem("access");
        if (!window.confirm("Czy na pewno?")) return;

        try {
            const res = await fetch(`${API_URL}/accounts/savedCalculators/${id}/`, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`,},
            });
            if (!res.ok) throw new Error();

            setSavedCalculators(prev => prev.filter(i => i.id !== id));
        } catch {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const fetchData = async () => {
        const token = localStorage.getItem("access");

        if (!token) {
            setError("Odmowa dostępu");
            setLoading(false);
            return;
        }
            
        try {
            const [usersRes, savedCalculatorsRes] = await Promise.all([
                fetch(`${API_URL}/accounts/users/`, {
                    headers: {Authorization: `Bearer ${token}`, }, }),
                fetch(`${API_URL}/accounts/savedCalculators/`, {
                    headers: {Authorization: `Bearer ${token}`, }, }),
            ]);

            if (!usersRes.ok || !savedCalculatorsRes.ok) {
                throw new Error("Błąd danych");
            }

            const usersData = await usersRes.json();
            const savedCalculatorsData = await savedCalculatorsRes.json();
            
            setUsers(usersData);
            setSavedCalculators(savedCalculatorsData);
            setLoading(false);
            
        } catch (err) {
            console.error("Error:", err);
            setError("Brak dostępu do panelu admina");
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
            <h1>Panel Admina</h1>
        
                <h2>Konta</h2>
                {users.length === 0 ? (
                    <p>Brak danych.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{borderCollapse: "collapse", marginBottom: "2rem"}}>
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Email</th>
                            <th>Staff</th>
                            <th>Superuser</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((r) => (
                            <tr key={r.id}>
                                <td>{r.first_name}</td>
                                <td>{r.email}</td>
                                <td>{r.is_staff ? "YES" : "NO"}</td>
                                <td>{r.is_superuser ? "YES" : "NO"}</td>
                                <td><button onClick={() => deleteUser(r.id)}>Usuń</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
    
                <h2>Zapisane kalkulatory</h2>
                {savedCalculators.length === 0 ? (
                    <p>Brak danych.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{borderCollapse: "collapse", marginBottom: "2rem"}}>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Użytkownik</th>
                            <th>Nazwa</th>
                            <th>Data Utworzenia</th>
                            <th>Usuń</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savedCalculators.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.user_email}</td>
                                <td>{r.name}</td>
                                <td>{r.created_at}</td>
                                <td><button onClick={() => deleteCalculator(r.id)}>Usuń</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

        </div>
    );
}


export default AdminPanel;





