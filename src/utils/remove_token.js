import { accessTokenKey, refreshTokenKey } from "../constants";

function removeTokensFromLocalStorage(){
    localStorage.removeItem(accessTokenKey)
    localStorage.removeItem(refreshTokenKey)
}
export default removeTokensFromLocalStorage;