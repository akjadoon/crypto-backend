// import FTX  from './ftx'
// import { DateTime } from 'luxon'
// import { simple_correlation, simulate_portfolio } from './stats';
// import { Portfolio } from './models';

// export async function main(){
//     const now = DateTime.utc().minus({hours: 2});
//     const start = now.minus({hours: 48});
//     // const btc_prices = await FTX.prices('SOL-PERP', '1D',  start, now);
//     // const sol_prices = await FTX.prices('SRM-PERP', '1D',  start, now);

//     // const corr = simple_correlation(btc_prices, sol_prices);
//     // console.log({corr})
//     const portfolio: Portfolio = {
//         amount: 10000,
//         positions: [
//             {
//                 market_name: 'SOL-PERP',
//                 weight: 0.5,
//                 side: 'buy'
//             },
//             {
//                 market_name: 'SRM-PERP',
//                 weight: 0.1,
//                 side: 'sell'
//             },
//             {
//                 market_name: 'RAY-PERP',
//                 weight: 0.1,
//                 side: 'sell'
//             },
//             {
//                 market_name: 'OXY-PERP',
//                 weight: 0.1,
//                 side: 'sell'
//             },
//             {
//                 market_name: 'STEP-PERP',
//                 weight: 0.1,
//                 side: 'sell'
//             },
//             {
//                 market_name: 'FIDA-PERP',
//                 weight: 0.1,
//                 side: 'sell'
//             }
//         ]
//     }
//     const result = await simulate_portfolio(portfolio, start, now);
//     console.log({result})
// }