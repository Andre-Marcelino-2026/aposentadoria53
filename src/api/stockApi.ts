// src/api/stockApi.ts
import { AssetPosition } from '../domain/models';

export interface StockData {
  price: number;
  changePercent: number;
}

// Preços e variações base para caso a API falhe ou o ativo seja fictício
const MOCK_PRICES: Record<string, StockData> = {
  AXIA3: { price: 15.3, changePercent: 1.25 },
  AXIA7: { price: 16.1, changePercent: -0.8 },
  B3SA3: { price: 11.45, changePercent: 0.5 },
  BBSE3: { price: 33.2, changePercent: 1.1 },
  BPAC11: { price: 35.8, changePercent: -1.2 },
  IRBR3: { price: 41.5, changePercent: 2.3 },
  ITSA4: { price: 10.35, changePercent: 0.0 },
  KLBN3: { price: 4.7, changePercent: -0.5 },
  OIBR3: { price: 1.55, changePercent: -5.0 },
  PRIO3: { price: 45.1, changePercent: 1.8 },
  SHUL4: { price: 6.2, changePercent: 0.2 },
  TAEE11: { price: 35.4, changePercent: -0.1 },
  INBR32: { price: 38.9, changePercent: 1.4 },
  ACWI11: { price: 115.5, changePercent: 0.8 },
  B5P211: { price: 85.2, changePercent: 0.1 },
  BOVA11: { price: 125.4, changePercent: 1.0 },
  DIVD11: { price: 140.3, changePercent: 0.3 },
  DIVO11: { price: 88.5, changePercent: 0.4 },
  HODL11: { price: 55.2, changePercent: -2.5 },
  IVVB11: { price: 295.1, changePercent: 1.2 },
  HSML11: { price: 95.4, changePercent: 0.2 },
  MXRF11: { price: 10.35, changePercent: -0.1 },
  MXRF13: { price: 10.3, changePercent: 0.0 },
  TRXF11: { price: 108.2, changePercent: 0.15 },
  VGIR11: { price: 9.85, changePercent: 0.05 },
  XPLG11: { price: 109.5, changePercent: -0.3 },
  CPTI11: { price: 82.3, changePercent: 0.1 },
};

export async function fetchStockData(
  ticker: string
): Promise<StockData | null> {
  const cleanTicker = ticker.trim().toUpperCase();

  // Ignora ativos de renda fixa, tesouro ou imóveis
  if (
    cleanTicker.includes('TD-') ||
    cleanTicker.includes('CDB') ||
    cleanTicker.includes('CAIXINHA') ||
    cleanTicker.includes('CASA') ||
    cleanTicker.includes('PRIV-') ||
    cleanTicker.includes('FGTS')
  ) {
    return null;
  }

  try {
    const response = await fetch(
      `https://brapi.dev/api/quote/${cleanTicker}?token=oirG1gyFEtXo7ubChNnZgK`
    );

    if (!response.ok) {
      return MOCK_PRICES[cleanTicker] || { price: 15.0, changePercent: 0 };
    }

    const data = await response.json();

    if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].regularMarketPrice
    ) {
      return {
        price: data.results[0].regularMarketPrice,
        changePercent: data.results[0].regularMarketChangePercent || 0,
      };
    }

    return MOCK_PRICES[cleanTicker] || { price: 15.0, changePercent: 0 };
  } catch (error) {
    return MOCK_PRICES[cleanTicker] || { price: 15.0, changePercent: 0 };
  }
}

/**
 * Atualiza a lista de ativos com as cotações em tempo real e variação diária
 */
export async function updateAssetsWithPrices(
  assets: AssetPosition[]
): Promise<any[]> {
  const updatedAssets = await Promise.all(
    assets.map(async (item) => {
      // Se for Renda Fixa ou Imóvel, mantém variação zero
      if (
        item.asset.assetClass === 'RENDA FIXA' ||
        item.asset.assetClass === 'IMÓVEIS'
      ) {
        return { ...item, dailyChangePercent: 0 };
      }

      const stockData = await fetchStockData(item.asset.ticker);

      if (stockData !== null) {
        const currentValue = stockData.price * item.currentQuantity;
        return {
          ...item,
          currentPrice: stockData.price,
          currentValue: currentValue,
          dailyChangePercent: stockData.changePercent,
          valuation: {
            ...item.valuation,
            lastUpdated: new Date(),
          },
        };
      }

      return { ...item, dailyChangePercent: 0 };
    })
  );

  return updatedAssets;
}
