import { useState } from "react";

function Login({ onAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null);

        try {
            const res = await fetch("http://127.0.0.1:8000/accounts/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            let data;
            try {
                data = await res.json();
            } catch {
                setError("Nieprawidłowa odpowiedź serwera");
                return;
            }
            console.log("LOGIN RESPONSE:", res.status, data);

            if (!res.ok) {
                setError(data.error || "Błąd logowania");
                return;
            }

            localStorage.setItem("token", data.token);
            onAuth();

        } catch (err) {
            setError("Błąd połączenia z serwerem")
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );

}
export default Login;
