import axios from "axios";
import config from "./config"

export interface KuCoinTicker {
    symbol: string;
    symbolName: string;
    buy: number;
    sell: number;
    changeRate: number,
    changePrice: number,
    high: number,
    low:number,
    vol: number,
    volValue: number,
    last: number,
    averagePrice: number,
    takerFeeRate: number,
    makerFeeRate: number,
    takerCoefficient: number,
    makerCoefficient: number
}

interface KuCoinAllTickersResult {
    code: string;
    data: {
        time: number;
        ticker: KuCoinTicker[];
    }
}

export class KuCoin {
    private url: string;
    constructor(){
        this.url = config.kuCoin.url;
    }

    async get<T>(path: string){
        const res = await axios.get<T>(this.url + path);
        return res;
    }

    async getAllTickers(): Promise<KuCoinTicker[]>{
        const res = await this.get<KuCoinAllTickersResult>('/market/allTickers');
        return res?.data?.data?.ticker;
    }
}