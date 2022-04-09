import axios from "axios";
import config from "./config";

export interface DeltaExchangeProduct {
    id: number;
    symbol: string;
    description: string;
    created_at: string;
    updated_at: string;
    settlement_time: string;
    notional_type: 'vanilla' | 'inverse';
    impact_size: number
    initial_margin: number;
    maintenance_margin: string;
    contract_value: string;
    contract_unit_currency: string;
    tick_size: string;
    product_specs: any;
    state: 'live' | 'expired' | 'upcoming';
    trading_status: 'operational' | 'disrupted_cancel_only' | 'disrupted_post_only';
    max_leverage_notional: string;
    default_leverage: string;
    initial_margin_scaling_factor: string;
    maintenance_margin_scaling_factor: string;
    taker_commission_rate: string;
    maker_commission_rate: string;
    liquidation_penalty_factor: string;
    contract_type: string;
    position_size_limit: number;
    basis_factor_max_limit: string;
    is_quanto: boolean;
    funding_method: string;
    annualized_funding: string;
    price_band: string;
    underlying_asset: {
        id: number;
        symbol: string;
        precision: number;
        deposit_status: 'enabled' | 'disabled';
        withdrawal_status: 'enabled' | 'disabled';
        base_withdrawal_fee: string;
        min_withdrawal_amount: string
    };
    quoting_asset: {
        id: number;
        symbol: string;
        precision: number;
        deposit_status: 'enabled' | 'disabled';
        withdrawal_status: 'enabled' | 'disabled';
        base_withdrawal_fee: string;
        min_withdrawal_amount: string
    };
    settling_asset: {
        id: number;
        symbol: string;
        precision: number;
        deposit_status: 'enabled' | 'disabled';
        withdrawal_status: 'enabled' | 'disabled';
        base_withdrawal_fee: string;
        min_withdrawal_amount: string
    };
    spot_index: {
        id: number;
        symbol: string;
        constituent_exchanges: [
        {}
        ];
        underlying_asset_id: number;
        quoting_asset_id: number;
        index_type: 'spot_pair' | 'fixed_interest_rate' | 'floating_interest_rate';
    }

}

export interface DeltaExchangeTicker {
        product_id: number;
        symbol: string;
        timestamp: number;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
        mark_price: string;
        spot_price: string;
        turnover: number;
        turnover_symbol: string;
        turnover_usd: number;
        contract_type: string
}

interface DeltaExchangeResult<T> {
    success: boolean;
    result: T;
}

export class DeltaExchange {
    private url;

    constructor(){
        this.url = config.delta.url;
    }

    async get<T>(path: string){
        const res = await axios.get<T>(this.url + path);
        return res;
    }

    async getProducts(): Promise<DeltaExchangeProduct[]> {
        const res = await this.get<DeltaExchangeResult<DeltaExchangeProduct[]>>('/products');
        return res?.data?.result;
    }

    async getTickers(): Promise<DeltaExchangeTicker[]> {
        const res = await this.get<DeltaExchangeResult<DeltaExchangeTicker[]>>('/tickers');
        return res?.data?.result;
    }
}