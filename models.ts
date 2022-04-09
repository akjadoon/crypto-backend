import { DateTime } from "luxon";

export interface Candle {
    dateTime: DateTime;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface FTXCandle {
    startTime: string;
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}


export interface FTXMarket {
    name: string;
    baseCurrency?: string; // spot markets only
    quoteCurrency?: 	string;	// spot markets only
    quoteVolume24h:	number;
    change1h: number;
    change24h: number;
    changeBod:	number; // change since start of day (00:00 UTC)
    highLeverageFeeExempt:	boolean;	
    minProvideSize:	number;
    type: "future" | "spot";
    underlying?: string;	// BTC future markets only
    enabled: boolean;	
    ask: number;
    bid: number;
    last:number;
    postOnly: boolean;
    price: number;
    priceIncrement:	number;	
    sizeIncrement: number;	
    restricted:	boolean;	// if the market has nonstandard restrictions on which jurisdictions can trade it
    volumeUsd24h: number;	
}

export interface PortfolioPosition {
    market_name: string;
    weight: number;
    side: 'buy' | 'sell';
    size?: number;
}

export interface Portfolio {
    amount: number;
    positions: PortfolioPosition[];
}

export interface TimeSeriesData {
    dateTime: string;
    value: number;
}