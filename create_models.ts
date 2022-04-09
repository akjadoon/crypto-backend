import { ArbitrageModel } from "./arbitrage";
import { InstrumentsModel } from "./instruments";
import { MetricsModel } from "./metrics";
import { PortfolioModel } from "./portfolio";
import { PricesModel } from "./prices";
import { storage } from "./storage";

export interface IModels {
    arbitrage: ArbitrageModel;
    instruments: InstrumentsModel;
    metrics: MetricsModel;
    prices: PricesModel;
    portfolio: PortfolioModel;

}

export function createModels(): IModels {
    const prices = new PricesModel(storage);
    const instruments = new InstrumentsModel(storage);
    const arbitrage = new ArbitrageModel(storage);
    const portfolio = new PortfolioModel(prices);
    const metrics = new MetricsModel(storage);

    return {
        arbitrage,
        instruments,
        metrics,
        prices,
        portfolio,
    }
}
