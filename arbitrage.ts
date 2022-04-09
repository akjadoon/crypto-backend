import _ from 'lodash'
import { MonthNumbers } from 'luxon';
import { IStorage } from "./storage";
import { sleep } from './utils';

interface ArbPrice {
    symbol: string;
    prices: {exch: string, bid: number, ask: number}[];
    best?: {
        percentage: number;
        exchange1: string;
        exchange2: string;
    }
}

interface BidAsk {
    exch: string;
    bid: number;
    ask: number;
}

export class ArbitrageModel {

    constructor(private storage: IStorage){}

    async simpleArbitrage(){
        while (true){

            const [ftxPrices, kuCoinPrices, deltaPrices] = await Promise.all([
                this.storage.ftx.markets(),
                this.storage.kuCoin.getAllTickers(),
                this.storage.delta.getTickers()
            ]);

            const pairs: {[key: string]: ArbPrice} = {};
            for (const p of ftxPrices){
                if (!(p.name in pairs))
                    pairs[p.name] = {symbol: p.name, prices: [{exch: 'FTX', bid: p.bid, ask: p.ask}]};
                else 
                pairs[p.name].prices.push({exch: 'FTX', bid: p.bid, ask: p.ask});
            }

            for (const p of kuCoinPrices){
                const symbol = p.symbol.replace('-', '/');//.replace('USDT', 'USD');
                const bidAsk = {exch: 'kuCoin', bid: p.sell, ask: p.buy};
                if (!(symbol in pairs))
                    pairs[symbol] = {symbol, prices: [bidAsk]};
                else 
                pairs[symbol].prices.push(bidAsk);
            }

            for (const p of deltaPrices){
                const symbol = p.symbol.replace('USDT', '/USDT');
                const bidAsk = {exch: 'delta', bid: parseFloat(p.spot_price), ask: parseFloat(p.spot_price)};
                if (!(symbol in pairs))
                    pairs[symbol] = {
                        symbol,
                        prices: [bidAsk]
                    };
                else 
                pairs[symbol].prices.push(bidAsk);
            }
    
            for (const [k, v] of Object.entries(pairs)){
            
                if (v.prices.length < 2)
                    continue;
                const maxBid = _.maxBy(v.prices, 'bid') as BidAsk;
                const minAsk = _.minBy(v.prices, 'ask') as BidAsk;
                if (maxBid.bid < minAsk.ask) continue;
                v.best = {
                    percentage: 100 * ((maxBid.bid - minAsk.ask) / minAsk.ask),
                    exchange1: minAsk.exch,
                    exchange2: maxBid.exch
                }
                
            }
            const bestArbs = Object.values(pairs).sort(
                (a, b) => 
                    (a?.best?.percentage || 0) > (b?.best?.percentage || 0) ? -1 : 1
            );
            console.log(bestArbs.slice(0, 10).map((x => ({symbol: x.symbol, best: x.best}))));
            await sleep(10*1000);
        }
    }

    async triangularArbitrage(){
        while (true){
            const basePairs: {[key: string]: {[symbol: string]: {bid: number, ask: number} } } = {};
            const kuCoinPrices = await this.storage.kuCoin.getAllTickers();
            
            for (const p of kuCoinPrices){
                const [quote, base] = p.symbol.split('-');
                if (!(base in basePairs))
                    basePairs[base] = {};
                basePairs[base][quote] = { bid: p.sell, ask: p.buy}; 

            }

            const usdtPairs = basePairs['USDT'];
            const btcPairs = basePairs['BTC'];
            const ethPairs = basePairs['ETH'];
            const ustPairs = basePairs['UST'];

            const btcUsdt = usdtPairs['BTC'];
            const ethUsdt = usdtPairs['ETH'];
            // const ustUsdt = usdtPairs['UST'];


            let bestArb = {symbol: '', second: '', percentage: 0};
            for (const [symbol,  price] of Object.entries(usdtPairs)){
                if (symbol in btcPairs){
                    const arbPercentage = (100 * price.ask) * (1/(btcPairs[symbol].bid)) * (1/btcUsdt.bid) - 100;
                    if (arbPercentage > bestArb.percentage){
                        bestArb.symbol = symbol;
                        bestArb.second = "BTC";
                        bestArb.percentage = arbPercentage;
                    }
                }
                if (symbol in ethPairs){
                    const arbPercentage = (100 * price.ask) * (1/(ethPairs[symbol].bid)) * (1/ethUsdt.bid) - 100;
                    if (arbPercentage > bestArb.percentage){
                        bestArb.symbol = symbol;
                        bestArb.second = "ETH";
                        bestArb.percentage = arbPercentage;
                    }
                }

                // if (symbol in ustPairs){
                //     const arbPercentage = (100 * price.ask) * (1/(ustPairs[symbol].bid)) * (1/ustUsdt.bid) - 100;
                //     if (arbPercentage > bestArb.percentage){
                //         bestArb.symbol = symbol;
                //         bestArb.second = "UST";
                //         bestArb.percentage = arbPercentage;
                //     }
                // }
            }
            console.log({bestArb})
            // return basePairs;
        }
    }
}