import axios from 'axios'
import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import { DateTime } from 'luxon';
import config from './config'
import { Candle, FTXCandle, FTXMarket } from './models';
import { formatParams } from './utils';

export type FTXCandleSize = 
    '15s' |
    '1m' |
    '5m' |
    '15m'|
    '1h' |
    '4h' |
    '1D' |
    '1W' | 
    '1M';

const FTXCandleSizeInSeconds = {
    '15s': '15',
    '1m': '60',
    '5m': '300',
    '15m': '900',
    '1h': '3600',
    '4h': '14400',
    '1D': '86400',
    '1W': '604800',
    '1M': '2592000'
}

export class FTX {
    private secret_key;
    private public_key
    private url;
    constructor(){
        this.secret_key = config.ftx.secret_key;
        this.public_key = config.ftx.public_key;
        this.url = config.ftx.url
    }

    sign_string(path: string, ms: number) {
        const method = 'GET';
        const ftx_sign_string = `${ms}${method}${path}`
        return hmacSHA256( ftx_sign_string, this.secret_key).toString();
    }

    async get<T>(path: string){
        let ms = new Date().getTime();
        const sign_string = this.sign_string(path, ms);
        const res = await axios.get<T>(this.url + path, {
            headers: {
            'FTX-KEY': this.public_key,
            'FTX-SIGN': sign_string,
            'FTX-TS': ms.toString()
            }
        })
        return res;
    }

    async prices(
        market_name: string,
        startDateTime: DateTime,
        endDateTime: DateTime,
        resolution: FTXCandleSize
    ): Promise<Candle[]> {
        const path = formatParams(
            `/markets/${market_name}/candles`,
            {
                resolution: FTXCandleSizeInSeconds[resolution],
                start_time: Math.floor(startDateTime.toUTC().toMillis() / 1000),
                end_time: Math.floor(endDateTime.toUTC().toMillis() / 1000)
            }
        );
        const res = await this.get<{result: FTXCandle[]}>(path);
        return this.mapFTXCandlestoCandles(res.data.result);
    }

    async markets(): Promise<FTXMarket[]> {
        const path = `/markets`
        const res = await this.get<{result: FTXMarket[]}>(path);
        return res.data.result;
    }

    private mapFTXCandlestoCandles(candles: FTXCandle[]): Candle[]{
        return candles.map(({high, low, open, close, volume, startTime}) => 
        ({high, low, open, close, volume, dateTime: DateTime.fromISO(startTime)}));
    }
}
