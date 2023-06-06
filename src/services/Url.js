export const webSocketUrl = () => {
    let current = window.origin;
    if(current.includes("localhost:") || current.includes("127.0.0.1:")){
        return "0.0.0.0:8000";  
    }else{
        return "loadzpro-staging-api.herokuapp.com";
    }
}


export const baseUrl = () => {
    let current = window.origin;
    if(current.includes("localhost:") || current.includes("127.0.0.1:")){
        return "0.0.0.0:8000";  
    }else{
        return "loadzpro-staging-api.herokuapp.com";
    }
}