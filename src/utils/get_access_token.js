import { accessTokenKey } from "../constants";

function getAccessToken(){
    return localStorage.getItem(accessTokenKey)
}
export default getAccessToken;