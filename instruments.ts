import { writeFile, readFile, writeFileSync, readFileSync } from "fs";
import { DateTime } from "luxon";
import { Credentials } from "./models";
import { GetExchangeListingsPayload, GetListingsPayload } from "./route_models";
import { IStorage } from "./storage";
import { isAdmin } from "./utils";


export interface InstrumentListing {
    market_name: string;
    dateTime: string;
}

export interface ExchangeListings {
    exchange: string;
    listings: InstrumentListing[];
}

export class InstrumentsModel {
    constructor(private storage: IStorage){}

    async saveListings(credentials: Credentials){
        if (!isAdmin(credentials)) return;

        const listings = await this.getListings();
        const exchangeListings: ExchangeListings = {exchange: "FTX", listings}
        const json = JSON.stringify([exchangeListings]);
        writeFileSync("data/listings.json", json, 'utf-8');
    }

    loadListings(): GetExchangeListingsPayload {
        const data = readFileSync("data/listings.json", "utf-8");
        if (!data) return {exchangeListings: []};
        const parsed: ExchangeListings[] = JSON.parse(data);
        return {exchangeListings: parsed};
    }

    async getListings(): Promise<InstrumentListing[]> {
        const markets = await this.storage.ftx.markets();

        const start = DateTime.fromISO("2016-01-01");
        const end = DateTime.utc();
        const listings: InstrumentListing[] = [];

        for (const [i, m] of markets.entries()){
            console.log("Getting listing date", i, " of ", markets.length, " for ", m.name);
            const prices = await this.storage.ftx.prices(m.name, start, end, "1D")
            listings.push({
                market_name: m.name, 
                dateTime: prices[0].dateTime.toISODate()}
            );
        }
        return listings;
    }

    getUsdListings(): GetListingsPayload {
        const {exchangeListings} = this.loadListings();
        return {
            listings: exchangeListings.find(
                o => o.exchange === "FTX")
                ?.listings
                .filter(
                    l => l.market_name.endsWith("/USD")
                ) || []
        }
    }
}