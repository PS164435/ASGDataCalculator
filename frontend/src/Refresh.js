import API_URL from "./api";

export async function fetchWithAuth(url, options = {}) {
    const access = localStorage.getItem("access");

    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
    };

    let res = await fetch(url, options);

    if (res.status === 401) {
        const refresh = localStorage.getItem("refresh");

        const refreshRes = await fetch(`${API_URL}/accounts/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
        });

        if (!refreshRes.ok) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            window.location.href = "/login";
            return;
        }

        const data = await refreshRes.json();
        localStorage.setItem("access", data.access);

        options.headers.Authorization = `Bearer ${data.access}`;
        res = await fetch(url, options);
    }

    return res;
}
