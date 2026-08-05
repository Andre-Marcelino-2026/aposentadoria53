// 1. Tipos Globais e Enums
export type Currency = 'BRL' | 'USD';
export type ConvictionLevel = 'ALTA' | 'MÉDIA' | 'BAIXA';
export type AssetStatus = 'ATIVO' | 'QUARENTENA' | 'VENDIDO' | 'WATCHLIST';

export enum AssetClass {
  STOCK = 'AÇÕES',
  BDR = 'BDR',
  ETF = 'ETF',
  FII = 'FII',
  FIXED_INCOME = 'RENDA FIXA',
  CRYPTO = 'CRIPTOATIVO',
  REAL_ESTATE = 'IMÓVEIS',
}

export enum TransactionType {
  BUY = 'COMPRA',
  SELL = 'VENDA',
  SPLIT = 'DESDOBRAMENTO',
  AMORTIZATION = 'AMORTIZAÇÃO',
}

// 2. Entidades Centrais
export interface UserProfile {
  id: string;
  currentAge: number;
  targetRetirementAge: number;
  targetMonthlyPassiveIncome: number;
  currencyPreference: Currency;
}

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  subSector: string;
  country: string;
  currency: Currency;
  status: AssetStatus;
  conviction: ConvictionLevel;
  portfolioRole: string;
  objective: string;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Motor Transacional
export interface Transaction {
  id: string;
  assetId: string;
  type: TransactionType;
  date: Date;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  fees: number;
}

// 4. Módulo de Renda Passiva
export interface Dividend {
  id: string;
  assetId: string;
  date: Date;
  amount: number;
  type: 'DIVIDENDO' | 'JCP' | 'RENDIMENTO' | 'JUROS';
}

// 5. Motor de Valuation
export interface Valuation {
  assetId: string;
  currentPrice: number;
  intrinsicValue: number | null;
  ceilingPrice: number | null;
  marginOfSafety: number | null;
  wacc: number | null;
  perpetuityGrowth: number | null;
  dividendYieldTarget: number | null;
  lastUpdated: Date;
}

// 6. Módulo de Research
export interface Research {
  assetId: string;
  thesis: string;
  buyRationale: string;
  risks: string;
  catalysts: string;
  comments: string;
  lastReviewDate: Date;
}

// 7. Agregador de Visualização
export interface AssetPosition {
  asset: Asset;
  currentQuantity: number;
  averagePrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  profitOrLossAbs: number;
  profitOrLossPct: number;
  portfolioWeightPct: number;
  valuation: Valuation;
}
