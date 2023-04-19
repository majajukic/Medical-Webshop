import axios from 'axios';

const BASE_URL = axios.create({ baseURL:"https://localhost:7156" });

//API endpointi za auth:
export const login = (formData) => BASE_URL.post("/api/account/login", formData);
export const register = (formData) => BASE_URL.post("/api/account/registracija", formData);