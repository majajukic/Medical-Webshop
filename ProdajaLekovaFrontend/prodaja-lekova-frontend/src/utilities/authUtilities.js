// Simple JWT decoder (for frontend use only - verification happens on backend)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }
  const decodedToken = decodeJWT(token)
  if (!decodedToken) {
    return null
  }
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

