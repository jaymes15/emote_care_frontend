import { accessTokenKey, refreshTokenKey } from "../constants";

function setTokensToLocalStorage(accessToken, refreshToken){
    localStorage.setItem(accessTokenKey, accessToken)
    localStorage.setItem(refreshTokenKey, refreshToken)
}
export default setTokensToLocalStorage;