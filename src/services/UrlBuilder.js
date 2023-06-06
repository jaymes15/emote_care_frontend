export function buildAPIUrl(resourcePath){
    let current = window.origin;
    if(current.includes("localhost:") || current.includes("127.0.0.1:")){
        return "http://localhost:8000/"+resourcePath;  
    }else{
        return "https://loadzpro-staging-api.herokuapp.com/"+resourcePath;
    }
}


export function webSocketUrl(){
    let current = window.origin;
    if(current.includes("localhost:") || current.includes("127.0.0.1:")){
        return "0.0.0.0:8000";  
    }else{
        return "loadzpro-staging-api.herokuapp.com";
    }
}


export function baseUrl(){
    let current = window.origin;
    if(current.includes("localhost:") || current.includes("127.0.0.1:")){
        return "0.0.0.0:8000";  
    }else{
        return "loadzpro-staging-api.herokuapp.com";
    }
}