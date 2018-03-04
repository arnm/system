import * as ccxt from 'ccxt';

async function exchange(name: string, symbol: string) {
    const ex = new ccxt[name]();

    const markets = await ex.loadMarkets();
    const market = markets[symbol];
    const { price_usd, rank } = market.info;

    const m = { symbol, price: price_usd, rank };
    return { name, market: m };
}

export default {
    Query: {
        exchange: (parent: any, args: any) => exchange(args.name, args.symbol)
    }
}
