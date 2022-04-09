import config from "./config";
import { Credentials } from "./models";

export function isAdmin(credentials: Credentials){
    return credentials &&
           credentials.username === config.admin.username &&
           credentials.password === config.admin.password;
}

export function formatParams(path: string, params: {[key: string]: number | string}){
    return path + '?' + 
        Object.entries(params).map(
            ([k, v]) => `${k}=${v}`
        ).join('&');
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}