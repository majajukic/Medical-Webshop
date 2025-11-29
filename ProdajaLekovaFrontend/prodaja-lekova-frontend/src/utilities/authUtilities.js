import jwt_decode from 'jwt-decode'

export const getUserRole = () => {
  const token = sessionStorage.getItem('token')
  if (!token) {
    return null
  }
  const decodedToken = jwt_decode(token)
  return (
    decodedToken[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ] || null
  )
}

export const bearerConfig = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return config;
}

