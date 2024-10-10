
export var urlApi;

if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
) {
    urlApi = "http://localhost:8000/api/";
}

const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
};

export const criarRequestOptions = (method, body) => {
    const data = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            ".AuthCookie": getCookie(".AuthCookie"),
        },
    };
    if (body) {
        if (body instanceof FormData) {
            data.body = body;
            delete data.headers["Content-Type"];
            return data;
        }
        data.body = JSON.stringify(body);
    }
    return data;
};

export const fetchJson = async (url, options) => {
    const response = await fetch(url, options); 
    const jsonResponse = await response.json();
    if (!response.ok) {
        if (response.status === 404) {
            alert(jsonResponse.erro.detalhes);
            return jsonResponse;
        }
        alert("Erro ao acessar a API");
    }
    return jsonResponse;
};






