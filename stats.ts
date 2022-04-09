// import { DateTime } from "luxon";
// import { start } from "repl";
// import FTX from "./ftx";
// import { Candle, Portfolio } from "./models";


// export function simple_correlation(base: Candle[], cmp: Candle[]): number[]{
//     // if(base.length !== cmp.length) throw Error("prices do not have equal length");

//     let corr = [];
//     for (let i = 1; i < base.length; i++){
//         let c1 = (base[i].close-base[i-1].close)/base[i-1].close;
//         let c2 = (cmp[i].close-cmp[i-1].close)/cmp[i-1].close;
//         corr.push((c2-c1)*100);
//     }

//     return corr;
// }

// export function vol_correlation(base: Candle[], cmp: Candle[]): number[]{
//     // if(base.length !== cmp.length) throw Error("prices do not have equal length");

//     let corr = [];
//     for (let i = 1; i < base.length; i++){
//         let c1 = (base[i].high-base[i-1].low)/base[i-1].close;
//         let c2 = (cmp[i].close-cmp[i-1].close)/cmp[i-1].close;
//         corr.push((c2-c1)*100);
//     }

//     return corr;
// }

// export async function simulate_portfolio(portfolio: Portfolio, startDateTime: DateTime, endDateTime: DateTime){
//     let finalAmount = 0;
//     const daily =  (await FTX.prices('BTC-PERP', '1h', startDateTime, endDateTime)).map(a => 0);
//     for (const p of portfolio.positions){
//         const prices = await FTX.prices(p.market_name, '1h', startDateTime, endDateTime);
//         const amount = (p.weight * portfolio.amount);
//         const size =  amount / prices[0].close;
//         const pnl =  (p.side === 'buy' ? 
//         prices[prices.length - 1].close  - prices[0].close : 
//         prices[0].close  - prices[prices.length - 1].close) * size;
//         finalAmount += amount + pnl;

//         for (let i = 1; i < prices.length;i++){
//             const pnl =  (p.side === 'buy' ? 
//             prices[i].close  - prices[0].close : 
//             prices[0].close  - prices[i].close) * size;
//             daily[i] += amount + pnl;
//         }
//     }

//     return {
//         start: startDateTime.toISODate(),
//         end: endDateTime.toISODate(),
//         amount: portfolio.amount,
//         finalAmount,
//         change: ((finalAmount-portfolio.amount) / portfolio.amount) * 100,
//         daily,
//         percentages: daily.map(d => ((d - portfolio.amount) / portfolio.amount)*100)
//     }
// }