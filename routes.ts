import {Express} from 'express'
import { IModels } from './create_models';
import { Credentials } from './models';
import { GetExchangeListingsPayload, GetListingsPayload, GetPortfolioInput, GetPortfolioPayload, GetPricesInput, GetPricesPayload } from './route_models';
import { asyncHandler } from './server';
import { storage } from './storage';

export function createRoutes(app: Express, models: IModels){
    post<GetPricesInput, GetPricesPayload>(app, '/prices', (i) => models.prices.getPrices(i));
    post<GetPortfolioInput, GetPortfolioPayload>(app, '/portfolios', (i) => models.portfolio.simulatePortfolio(i));
    post<Credentials, void>(app, '/saveListings', (i) => models.instruments.saveListings(i));
    get<GetExchangeListingsPayload>(app, '/loadListings', () => models.instruments.loadListings() );
    get<GetListingsPayload>(app, '/usdListings', () => models.instruments.getUsdListings()); 

    get(app, '/kucoin', () => storage.kuCoin.getAllTickers());
    get(app, '/delta', () => storage.delta.getTickers());

    get(app, '/arbitrage', () => models.arbitrage.simpleArbitrage()); 
    get(app, '/triArbitrage', () => models.arbitrage.triangularArbitrage()); 
    
    get(app, '/ath', () => models.metrics.allTimeHighsToday());     
    
}

function post<T, Q>(app: Express, path: string, handler:  ((input: T) => Promise<Q>) |  ((input: T) => Q)){
    app.post<any, any, any, T >(path, asyncHandler(async (req: any, res: any) => {
        console.log({headers: req})
        const result = await handler(req.body);
        res.send(result);
    }));
}

function get<Q>(app: Express, path: string, handler: (() => Promise<Q>) |  (() => Q)){
    app.get(path, asyncHandler(async (req: any, res: any) => {
        const result = await handler();
        res.send(result);
    }));
}

