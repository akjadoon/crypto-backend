import { DeltaExchange } from "./delta_exchange";
import { Discord } from "./discord";
import { FTX } from "./ftx";
import { KuCoin } from "./kucoin";


export interface IStorage {
    delta: DeltaExchange;
    discord: Discord;
    ftx: FTX;
    kuCoin: KuCoin;
}

export const storage = {
    delta: new DeltaExchange(),
    discord: new Discord(),
    ftx: new FTX(),
    kuCoin: new KuCoin()
}