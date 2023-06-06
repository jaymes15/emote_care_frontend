export default function buildAPIUrl (resourcePath){
    let current = window.origin;
    if(current.includes("localhost:") || current.includes("127.0.0.1:")){
        return "http://localhost:8000/"+resourcePath;  
    }else{
        return "https://loadzpro-staging-api.herokuapp.com/"+resourcePath;
    }
}


