export const tokenKey = "accessToken";
export const refreshKey = "refreshToken";

export function getAccessToken() {
  return localStorage.getItem(tokenKey);
}
export function getRefreshToken() {
  return localStorage.getItem(refreshKey);
}
export function removeAccessToken() {
  localStorage.removeItem(tokenKey);
}
export function removeRefreshToken() {
  localStorage.removeItem(refreshKey);
}
export function setAccessToken(token: string) {
  localStorage.setItem(tokenKey, token);
}
export function setRefreshToken(token: string) {
  localStorage.setItem(refreshKey, token);
}
