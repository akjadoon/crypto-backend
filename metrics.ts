import { DateTime } from "luxon";
import { PricesModel } from "./prices";
import { IStorage } from "./storage";

export class MetricsModel {
    constructor(private storage: IStorage){}
    async allTimeHighsToday(){
        const perps = (await this.storage.ftx.markets()).filter(item => item.name.endsWith('PERP'));
        console.log(`Got ${perps.length} perps`)
        const allPerpsCandles = await Promise.all(
            perps.map(
                p => this.storage.ftx.prices(
                    p.name, DateTime.fromISO('2017-01-01'),
                    DateTime.now(),
                    '1D'
                )
            )
        );
        const athsToday = perps.filter(({name}, i) => {
            const candles = allPerpsCandles[i];
            const ath = candles.reduceRight((acc, cur) => Math.max(acc, cur.high), 0);
            const todaysHigh = candles[candles.length - 1].high;
            return todaysHigh >= ath;
        });

        for (const {name, last} of athsToday){
            console.log(`${name}, last price: ${last}`)
        }
    }
}
