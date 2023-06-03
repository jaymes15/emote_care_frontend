export default function buildAPIUrl(resourcePath){
    let current = window.origin;
    return "http://localhost:8000/"+resourcePath;  
}

