import { DateTime } from "luxon";
import { FTXCandleSize } from "./ftx";
import { GetPricesInput, GetPricesPayload } from "./route_models";
import { IStorage } from "./storage";


export class PricesModel {
    constructor(private storage: IStorage){}

    async getPrices({market_name, startDateTime, endDateTime}: GetPricesInput): Promise<GetPricesPayload> {
        console.log({market_name})
        const start = DateTime.fromISO(startDateTime);
        const end = endDateTime ? DateTime.fromISO(endDateTime as string) : DateTime.utc();
        const days = end.diff(start).as("days");
        const resolution = this.mapToCandleSize(days);
        const prices = await this.storage.ftx.prices(market_name, start, end, resolution);
        return {candles: prices};
    }

    private mapToCandleSize(days: number): FTXCandleSize {
        if (days <= 1)
            return '15m';
        else if (days <= 7)
            return '1h';
        else if (days <= 28)
            return '4h';
        else if (days < 365)
            return '1D';
        else 
            return '1W';
    }
}