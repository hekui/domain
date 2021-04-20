import Cookies from 'js-cookie'
// js-cookie使用方法将：https://github.com/js-cookie/js-cookie
const TokenKey = 'ticketId'

export function setToken(token, options = {}) {
  return Cookies.set(TokenKey, token, options)
}
export function getToken() {
  return Cookies.get(TokenKey)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
