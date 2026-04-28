import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Content-Type": "application/json",
        ...(process.env.WS_SERVICE_TOKEN
            ? { "X-Service-Token": process.env.WS_SERVICE_TOKEN }
            : {}),
    }
});