import { DateTime } from "luxon";
import { TimeSeriesData } from "./models";
import { PricesModel } from "./prices";
import { GetPortfolioInput, GetPortfolioPayload } from "./route_models";


export class PortfolioModel {
    constructor(private prices: PricesModel){}
    async simulatePortfolio({portfolio, startDateTime, endDateTime}: GetPortfolioInput): Promise<GetPortfolioPayload> {
        if (!endDateTime)
            endDateTime = DateTime.utc().toISO();
        let finalAmount = 0;
        const amounts: TimeSeriesData[] =  (
            await this.prices.getPrices({
                market_name: 'BTC-PERP',
                startDateTime,
                endDateTime
        }))
        .candles.map(
            a =>  ({
                dateTime: a.dateTime.toISO(),
                value: 0
            })
        );
        amounts[0].value = portfolio.amount;
        for (const p of portfolio.positions){
            const prices = (
                await this.prices.getPrices({market_name: p.market_name, startDateTime, endDateTime})
            ).candles;
            const initialAmountinUSD = (p.weight * portfolio.amount);
            const size =  initialAmountinUSD / prices[0].close;

            finalAmount += (
                p.side === 'buy' ? 
                    prices[prices.length -1].close :
                    (2 * prices[0].close - prices[prices.length - 1].close)
                ) * size ;

            for (let i = 1; i < prices.length;i++){
                amounts[i].value += (
                    p.side === 'buy' ? 
                        prices[i].close :
                        (2 * prices[0].close - prices[i].close)
                    ) * size ;
            }
        }

        return {
            startDateTime,
            endDateTime,
            amount: portfolio.amount,
            finalAmount,
            percentChange: ((finalAmount-portfolio.amount) / portfolio.amount) * 100,
            amounts,
        }
    }

    async getPortfolioInstruments(){

    }
}