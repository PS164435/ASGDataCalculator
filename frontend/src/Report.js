import React, { useEffect, useState } from "react";
import API_URL from "./api";

function Report() {
  const [report, setReport] = useState(null);
  const [calculatorsAmount, setCalculatorsAmount] = useState(0);

  const countCalculators = async () => {
        const token = localStorage.getItem("access");
        if (!token) return;
        const res = await fetch(`${API_URL}/accounts/calculators/`, {
            headers: {Authorization: `Bearer ${token}`,},});
        if (!res.ok) {alert("Nie udało się pobrać zapisów"); return;}
        const data = await res.json();
        setCalculatorsAmount(data.length);
    };
  
  const fetchData = async () => {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_URL}/accounts/report/`, {headers: {Authorization: `Bearer ${token}`}})
      if (!res.ok) {console.error("Błąd pobierania danych"); return;}
      const data = await res.json();
      setReport(data);
    }
  useEffect(() => {
    fetchData();
    countCalculators();
  }, []);

  if (!report) return <p>Loading...</p>;
  
  return (
      <div>
        <h1>Raport</h1>
        <p>Liczba logowań: {report.login_amount}</p>
        <p>Liczba zapisanych kalkulatorów: {calculatorsAmount}</p>
      </div>
    )
}

export default Report;
