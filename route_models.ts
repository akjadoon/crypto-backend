import { ExchangeListings, InstrumentListing } from "./Instruments";
import { Candle, Portfolio, TimeSeriesData } from "./models";


export interface GetExchangeListingsPayload {
    exchangeListings: ExchangeListings[];
}
 
export interface GetListingsPayload {
    listings: InstrumentListing[];
}

export interface GetPortfolioInput {
    portfolio: Portfolio;
    startDateTime: string;
    endDateTime?: string;
}

export interface GetPortfolioPayload {
    startDateTime: string;
    endDateTime: string;
    amount: number;
    finalAmount: number;
    percentChange: number;
    amounts: TimeSeriesData[];
}

export interface GetPricesInput {
    market_name: string;
    startDateTime: string;
    endDateTime?: string;
}

export interface GetPricesPayload {
    candles: Candle[];
}

