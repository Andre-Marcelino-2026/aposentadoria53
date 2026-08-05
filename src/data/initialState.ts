import { UserProfile, AssetPosition } from '../domain/models';

export const userProfile: UserProfile = {
  id: 'usr_001',
  currentAge: 47,
  targetRetirementAge: 53,
  targetMonthlyPassiveIncome: 5000.0,
  currencyPreference: 'BRL',
};

export const initialAssets: Partial<AssetPosition>[] = [
  // --- AÇÕES ---
  {
    asset: { ticker: 'AXIA3', name: 'Axia', assetClass: 'AÇÕES' } as any,
    currentQuantity: 122,
  },
  {
    asset: { ticker: 'AXIA7', name: 'Axia PN', assetClass: 'AÇÕES' } as any,
    currentQuantity: 32,
  },
  {
    asset: { ticker: 'B3SA3', name: 'B3 S.A.', assetClass: 'AÇÕES' } as any,
    currentQuantity: 360,
  },
  {
    asset: {
      ticker: 'BBSE3',
      name: 'BB Seguridade',
      assetClass: 'AÇÕES',
    } as any,
    currentQuantity: 103,
  },
  {
    asset: {
      ticker: 'BPAC11',
      name: 'BTG Pactual',
      assetClass: 'AÇÕES',
    } as any,
    currentQuantity: 142,
  },
  {
    asset: { ticker: 'IRBR3', name: 'IRB Brasil', assetClass: 'AÇÕES' } as any,
    currentQuantity: 33,
  },
  {
    asset: { ticker: 'ITSA4', name: 'Itaúsa', assetClass: 'AÇÕES' } as any,
    currentQuantity: 905,
  },
  {
    asset: { ticker: 'KLBN3', name: 'Klabin', assetClass: 'AÇÕES' } as any,
    currentQuantity: 1769,
  },
  {
    asset: { ticker: 'OIBR3', name: 'Oi S.A.', assetClass: 'AÇÕES' } as any,
    currentQuantity: 20,
  },
  {
    asset: { ticker: 'PRIO3', name: 'Prio', assetClass: 'AÇÕES' } as any,
    currentQuantity: 175,
  },
  {
    asset: { ticker: 'SHUL4', name: 'Schulz', assetClass: 'AÇÕES' } as any,
    currentQuantity: 297,
  },
  {
    asset: { ticker: 'TAEE11', name: 'Taesa', assetClass: 'AÇÕES' } as any,
    currentQuantity: 143,
  },

  // --- BDR ---
  {
    asset: { ticker: 'INBR32', name: 'Inter&Co', assetClass: 'BDR' } as any,
    currentQuantity: 70,
  },

  // --- ETFs ---
  {
    asset: { ticker: 'ACWI11', name: 'Trend ACWI', assetClass: 'ETF' } as any,
    currentQuantity: 192,
  },
  {
    asset: {
      ticker: 'B5P211',
      name: 'It Now IMAB5+',
      assetClass: 'ETF',
    } as any,
    currentQuantity: 52,
  },
  {
    asset: {
      ticker: 'BOVA11',
      name: 'iShares Ibovespa',
      assetClass: 'ETF',
    } as any,
    currentQuantity: 30,
  },
  {
    asset: { ticker: 'DIVD11', name: 'It Now IDIV', assetClass: 'ETF' } as any,
    currentQuantity: 40,
  },
  {
    asset: { ticker: 'DIVO11', name: 'It Now DIVO', assetClass: 'ETF' } as any,
    currentQuantity: 732,
  },
  {
    asset: {
      ticker: 'HODL11',
      name: 'Hashdex Cripto',
      assetClass: 'ETF',
    } as any,
    currentQuantity: 85,
  },
  {
    asset: {
      ticker: 'IVVB11',
      name: 'iShares S&P 500',
      assetClass: 'ETF',
    } as any,
    currentQuantity: 20,
  },

  // --- FIIs ---
  {
    asset: { ticker: 'HSML11', name: 'HSI Malls', assetClass: 'FII' } as any,
    currentQuantity: 568,
  },
  {
    asset: { ticker: 'MXRF11', name: 'Maxi Renda', assetClass: 'FII' } as any,
    currentQuantity: 3826,
  },
  {
    asset: {
      ticker: 'MXRF13',
      name: 'Maxi Renda (Direito)',
      assetClass: 'FII',
    } as any,
    currentQuantity: 864,
  },
  {
    asset: {
      ticker: 'TRXF11',
      name: 'TRX Real Estate',
      assetClass: 'FII',
    } as any,
    currentQuantity: 140,
  },
  {
    asset: {
      ticker: 'VGIR11',
      name: 'Valora RE III',
      assetClass: 'FII',
    } as any,
    currentQuantity: 1215,
  },
  {
    asset: { ticker: 'XPLG11', name: 'XP Log', assetClass: 'FII' } as any,
    currentQuantity: 117,
  },
  {
    asset: {
      ticker: 'CPTI11',
      name: 'Capitânia Infra',
      assetClass: 'FII',
    } as any,
    currentQuantity: 72,
  },

  // --- RENDA FIXA & OUTROS ---
  {
    asset: {
      ticker: 'TD-IPCA-2029',
      name: 'Tesouro IPCA+ 2029',
      assetClass: 'RENDA FIXA',
    } as any,
    currentQuantity: 10.05,
  },
  {
    asset: {
      ticker: 'TD-IPCA-2032',
      name: 'Tesouro IPCA+ 2032',
      assetClass: 'RENDA FIXA',
    } as any,
    currentQuantity: 3.41,
  },
  {
    asset: {
      ticker: 'CDB-ITAU',
      name: 'CDB Itaú',
      assetClass: 'RENDA FIXA',
    } as any,
    currentQuantity: 1,
  },
  {
    asset: {
      ticker: 'PRIV-DI-ITAU',
      name: 'Privilege DI Itaú',
      assetClass: 'RENDA FIXA',
    } as any,
    currentQuantity: 1,
  },
  {
    asset: {
      ticker: 'CAIXINHA-100',
      name: 'Caixinha Nubank 100%',
      assetClass: 'RENDA FIXA',
    } as any,
    currentQuantity: 1,
  },
  {
    asset: {
      ticker: 'CAIXINHA-120',
      name: 'Caixinha Nubank 120%',
      assetClass: 'RENDA FIXA',
    } as any,
    currentQuantity: 1,
  },
  {
    asset: { ticker: 'FGTS', name: 'FGTS', assetClass: 'RENDA FIXA' } as any,
    currentQuantity: 1,
  },
  {
    asset: {
      ticker: 'CASA-PROPRIA',
      name: 'Casa Própria',
      assetClass: 'IMÓVEIS',
    } as any,
    currentQuantity: 1,
  },
].map((item) => ({
  ...item,
  averagePrice: null,
  currentPrice: null,
  totalInvested: null,
  currentValue: null,
  profitOrLossAbs: null,
  profitOrLossPct: null,
  portfolioWeightPct: null,
  valuation: {
    intrinsicValue: null,
    ceilingPrice: null,
    marginOfSafety: null,
    wacc: null,
    perpetuityGrowth: null,
    dividendYieldTarget: null,
    lastUpdated: new Date(),
  },
})) as AssetPosition[];
