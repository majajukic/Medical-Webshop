import axios from 'axios'

const BASE_URL = axios.create({ baseURL: 'https://localhost:7156' })

//API endpointi za auth:
export const login = (formData) => BASE_URL.post('/api/account/login', formData)
export const register = (formData) => BASE_URL.post('/api/account/registracija', formData)

//API endpointi za apoteke:
export const getApoteke = () => BASE_URL.get('/api/apoteka')
export const deleteApoteka = (id, authConfig) => BASE_URL.delete(`/api/apoteka/${id}`, authConfig)
export const createApoteka = (newPharmacy, authConfig) => BASE_URL.post(`/api/apoteka`, newPharmacy, authConfig)
export const updateApoteka = (updatedPharmacy, authConfig) => BASE_URL.put(`/api/apoteka`, updatedPharmacy, authConfig)

//API endpointi za proizvode:
export const getProizvodi = () => BASE_URL.get('/api/proizvod')
export const getProizvodById = (id, authConfig) => BASE_URL.get(`/api/proizvod/${id}`, authConfig)
export const getTipoviProizvoda = () => BASE_URL.get('/api/tipProizvoda')
export const getProizvodiHomePage = (pageNumber) => BASE_URL.get(`/api/apotekaProizvod?PageNumber=${pageNumber}`)
export const getProizvodiCenaRastuce = (pageNumber) => BASE_URL.get(`/api/apotekaProizvod/byCenaRastuce?PageNumber=${pageNumber}`)
export const getProizvodiCenaOpadajuce = (pageNumber) => BASE_URL.get(`/api/apotekaProizvod/byCenaOpadajuce?PageNumber=${pageNumber}`)
export const getProizvodiPopust = () => BASE_URL.get('/api/apotekaProizvod/naPopustu')
export const getProizvodiBySearch = (searchTerm) => BASE_URL.get(`/api/apotekaProizvod?searchTerm=${searchTerm}`)
export const getProizvodiByApoteka = (pharmacy, pageNumber) => BASE_URL.get(`/api/apotekaProizvod?PageNumber=${pageNumber}&apotekaId=${pharmacy}`)
export const getProizvodByApoteka = (pharmacyId) => BASE_URL.get(`/api/apotekaProizvod/${pharmacyId}`)
export const getProizvodiByTip = (pageNumber, type) => BASE_URL.get(`/api/apotekaProizvod/byTipProizvoda?PageNumber=${pageNumber}&tipProizvodaId=${type}`)
export const getProizvodiCountByApoteka = (pharmacy) => BASE_URL.get(`/api/apotekaProizvod/ukupnoProizvoda?apotekaId=${pharmacy}`)
export const getProizvodiCount = () => BASE_URL.get('/api/apotekaProizvod/ukupnoProizvoda')
export const getProizvodiByTipCount = (type) => BASE_URL.get(`/api/apotekaProizvod/ukupnoProizvodaPoTipu?tipProizvodaId=${type}`)
export const deleteProizvod = (id, authConfig) => BASE_URL.delete(`/api/proizvod/${id}`, authConfig)
export const deleteProizvodFromApoteka = (id, authConfig) => BASE_URL.delete(`/api/apotekaProizvod/${id}`, authConfig)
export const createProizvod = (newProduct, authConfig) => BASE_URL.post(`/api/proizvod`, newProduct, authConfig)
export const addProizvodToApoteka = (newProduct, authConfig) => BASE_URL.post(`/api/apotekaProizvod`, newProduct, authConfig)
export const updateProizvod = (updatedProduct, authConfig) => BASE_URL.put(`/api/proizvod`, updatedProduct, authConfig)
export const updateProizvodInApoteka = (updatedProduct, authConfig) => BASE_URL.put(`/api/apotekaProizvod`, updatedProduct, authConfig)

//API endpointi za korisnike:
export const getKorisnici = (authConfig) => BASE_URL.get('/api/korisnik', authConfig)
export const getProfil = (authConfig) => BASE_URL.get('/api/korisnik/profil', authConfig)
export const deleteKorisnik = (id, authConfig) => BASE_URL.delete(`/api/korisnik/${id}`, authConfig)
export const createKorisnik = (newUser, authConfig) => BASE_URL.post(`/api/korisnik`, newUser, authConfig)
export const updateKorisnik = (updatedUser, authConfig) => BASE_URL.put(`/api/korisnik`, updatedUser, authConfig)

//API endpointi za porudzbine:
export const getPorudzbine = (authConfig) => BASE_URL.get('/api/porudzbina', authConfig)
export const getPorudzbineByKupac = (authConfig) => BASE_URL.get('/api/porudzbina/porudzbineByKupac', authConfig)
export const deletePorudzbina = (id, authConfig) => BASE_URL.delete(`/api/porudzbina/${id}`, authConfig)

