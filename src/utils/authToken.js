// src/utils/authToken.js

// Utilidad para manejar el token de autenticación en localStorage

export function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function removeAuthToken() {
  localStorage.removeItem('authToken');
}
