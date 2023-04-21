import axios from 'axios'

const BASE_URL = axios.create({ baseURL: 'https://localhost:7156' })

//API endpointi za auth:
export const login = (formData) => BASE_URL.post('/api/account/login', formData)
export const register = (formData) => BASE_URL.post('/api/account/registracija', formData)

//API endpointi za apoteke:
export const getApoteke = () => BASE_URL.get('/api/apoteka')

//API endpointi za proizvode:
export const getProizvodi = () => BASE_URL.get('/api/proizvod')

//API endpointi za korisnike:
export const getKorisnici = (authConfig) => BASE_URL.get('api/korisnik', authConfig)
export const getProfil = (authConfig) => BASE_URL.get('api/korisnik/profil', authConfig)

//API endpointi za porudzbine:
export const getPorudzbine = (authConfig) => BASE_URL.get('api/porudzbina', authConfig)
export const getPorudzbineByKupac = (authConfig) => BASE_URL.get('api/porudzbina/porudzbineByKupac', authConfig)

