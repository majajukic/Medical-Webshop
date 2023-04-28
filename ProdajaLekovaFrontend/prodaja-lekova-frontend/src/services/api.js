import axios from 'axios'

const BASE_URL = axios.create({ baseURL: 'https://localhost:7156' })

//API endpointi za auth:
export const login = (formData) => BASE_URL.post('/api/account/login', formData)
export const register = (formData) => BASE_URL.post('/api/account/registracija', formData)

//API endpointi za apoteke:
export const getApoteke = () => BASE_URL.get('/api/apoteka')
export const deleteApoteka = (id, authConfig) => BASE_URL.delete(`api/apoteka/${id}`, authConfig)

//API endpointi za proizvode:
export const getProizvodi = () => BASE_URL.get('/api/proizvod')
export const getTipoviProizvoda = () => BASE_URL.get('/api/tipProizvoda')
export const getProizvodiHomePage = () => BASE_URL.get('/api/apotekaProizvod')
export const getProizvodiCenaRastuce = () => BASE_URL.get('/api/apotekaProizvod/byCenaRastuce')
export const getProizvodiCenaOpadajuce = () => BASE_URL.get('/api/apotekaProizvod/byCenaOpadajuce')
export const getProizvodiPopust = () => BASE_URL.get('/api/apotekaProizvod/naPopustu')
export const getProizvodiBySearch = (searchTerm) => BASE_URL.get(`/api/apotekaProizvod?searchTerm=${searchTerm}`)
export const getProizvodiByApoteka = (pharmacy) => BASE_URL.get(`/api/apotekaProizvod?apotekaId=${pharmacy}`)
export const getProizvodiByTip = (type) => BASE_URL.get(`/api/apotekaProizvod/byTipProizvoda?tipProizvodaId=${type}`)
export const deleteProizvod = (id, authConfig) => BASE_URL.delete(`api/apotekaProizvod/${id}`, authConfig)

//API endpointi za korisnike:
export const getKorisnici = (authConfig) => BASE_URL.get('api/korisnik', authConfig)
export const getProfil = (authConfig) => BASE_URL.get('api/korisnik/profil', authConfig)
export const deleteKorisnik = (id, authConfig) => BASE_URL.delete(`api/korisnik/${id}`, authConfig)

//API endpointi za porudzbine:
export const getPorudzbine = (authConfig) => BASE_URL.get('api/porudzbina', authConfig)
export const getPorudzbineByKupac = (authConfig) => BASE_URL.get('api/porudzbina/porudzbineByKupac', authConfig)
export const deletePorudzbina = (id, authConfig) => BASE_URL.delete(`api/porudzbina/${id}`, authConfig)

