import React, {useCallback, useEffect, useState} from "react";
import {Routes, Route, Link} from "react-router-dom";
import Tables from "./Tables";
import Calculator from "./Calculator";
import './main.css';
import Login from "./Login";
import Register from "./Register";
import API_URL from "./api";

function App() {

    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
    const [userName, setUserName] = useState(null);

    const logout = useCallback(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setLoggedIn(false)
        setUserName(null);
    }, []);

    const myName = useCallback(async () => {
        const token = localStorage.getItem("access");

        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/accounts/name/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                logout();
                return;
            }
            const data = await res.json();
            setUserName(data.first_name);
        } catch (err) {
            alert("Błąd pobierania nazwy")
        }
    }, [logout]);

    useEffect(() => {
        if (loggedIn) myName();
    }, [loggedIn, myName]);


  return (
    <div>
      <nav>
        <Link to="/tables">Baza Danych</Link>
        <Link to="/calculator">Kalkulator</Link>

            <div className="nav-auth">
              {loggedIn ? (
                  <>
                  <span className="nav-status">{userName ? `${userName}` : "Zalogowano"}</span>
                  <button className="button-logout" onClick={logout}>Wyloguj</button>
                  </>
              ) : (
                  <>
                      <Link to="/login">Sign in</Link>
                      <Link to="/register">Sign up</Link>
                  </>
              )}
          </div>

      </nav>
      <Routes>
        <Route path="/tables" element={<Tables/>}/>
        <Route path="/calculator" element={<Calculator/>}/>

        {!loggedIn && (
              <>
              <Route
                path="/login"
                element={<Login onAuth={() => {setLoggedIn(true); myName();}} />}
              />
              <Route
                path="/register"
                element={<Register onAuth={() => {setLoggedIn(true); myName()}} />}
              />
              </>
        )}

        <Route path="*" element={<Tables />} />
      </Routes>
    </div>
  );
}

export default App;
