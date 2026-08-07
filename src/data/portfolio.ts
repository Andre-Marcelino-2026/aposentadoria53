// Base de Dados Unificada do Projeto Aposentadoria 53
// Extrato B3 + Regras Táticas de Valuation e Alocação

export interface Acao {
  ticker: string;
  nome: string;
  quantidade: number;
  precoAtual: number;
  precoTeto: number;
  categoria: 'Dividendos' | 'Crescimento';
  dy: number;
  research: string;
}

export interface FII {
  ticker: string;
  nome: string;
  quantidade: number;
  precoAtual: number;
  precoTeto: number;
  segmento: string;
  dyMensal: number;
  research: string;
}

export interface RendaFixa {
  nome: string;
  tipo: 'Tesouro Direto' | 'CDB' | 'LCI/LCA';
  quantidade: number;
  valorAplicado: number;
  valorAtual: number;
  vencimento: string;
}

export interface UserProfile {
  targetMonthlyPassiveIncome: number;
  targetAllocations: {
    acoes: number;      // % desejada em Ações
    fiis: number;       // % desejada em FIIs
    rendaFixa: number;  // % desejada em Renda Fixa
  };
}

export const userProfile: UserProfile = {
  targetMonthlyPassiveIncome: 5000,
  targetAllocations: {
    acoes: 30,
    fiis: 20,
    rendaFixa: 50,
  },
};

// Carteira Real de Ações (Posição B3)
export const portfolioAcoes: Acao[] = [
  {
    ticker: 'AXIA3',
    nome: 'AXIA ENERGIA S.A. ON',
    quantidade: 122,
    precoAtual: 53.97,
    precoTeto: 62.00,
    categoria: 'Dividendos',
    dy: 7.2,
    research: 'Nord Research',
  },
  {
    ticker: 'AXIA7',
    nome: 'AXIA ENERGIA S.A. PNC',
    quantidade: 32,
    precoAtual: 52.80,
    precoTeto: 60.00,
    categoria: 'Dividendos',
    dy: 7.5,
    research: 'Nord Research',
  },
  {
    ticker: 'B3SA3',
    nome: 'B3 S.A. ON',
    quantidade: 360,
    precoAtual: 14.40,
    precoTeto: 16.50,
    categoria: 'Crescimento',
    dy: 4.8,
    research: 'Empiricus',
  },
  {
    ticker: 'BBSE3',
    nome: 'BB SEGURIDADE ON',
    quantidade: 103,
    precoAtual: 38.13,
    precoTeto: 42.00,
    categoria: 'Dividendos',
    dy: 8.9,
    research: 'Suno Research',
  },
  {
    ticker: 'BPAC11',
    nome: 'BCO BTG PACTUAL UNIT',
    quantidade: 142,
    precoAtual: 54.00,
    precoTeto: 58.00,
    categoria: 'Crescimento',
    dy: 2.5,
    research: 'BTG Research',
  },
  {
    ticker: 'IRBR3',
    nome: 'IRB BRASIL ON',
    quantidade: 33,
    precoAtual: 54.74,
    precoTeto: 50.00,
    categoria: 'Crescimento',
    dy: 1.2,
    research: 'Genial Analisa',
  },
];

// Carteira Real de FIIs / Fundos (Posição B3)
export const portfolioFIIs: FII[] = [
  {
    ticker: 'XPLG11',
    nome: 'XP LOG FDO INV IMOB',
    quantidade: 117,
    precoAtual: 93.26,
    precoTeto: 105.00,
    segmento: 'Logística',
    dyMensal: 0.82,
    research: 'Suno Research',
  },
  {
    ticker: 'CPTI11',
    nome: 'CAPITÂNIA FDO. INV. FINANCEIRO',
    quantidade: 72,
    precoAtual: 85.84,
    precoTeto: 95.00,
    segmento: 'Papel / Crédito',
    dyMensal: 0.95,
    research: 'Nord Research',
  },
];

// Carteira Real de Renda Fixa / Tesouro Direto (Posição B3)
export const portfolioRendaFixa: RendaFixa[] = [
  {
    nome: 'Tesouro IPCA+ 2029',
    tipo: 'Tesouro Direto',
    quantidade: 10.05,
    valorAplicado: 35029.13,
    valorAtual: 37648.80,
    vencimento: '15/05/2029',
  },
  {
    nome: 'Tesouro IPCA+ 2032',
    tipo: 'Tesouro Direto',
    quantidade: 3.41,
    valorAplicado: 10025.80,
    valorAtual: 9871.57,
    vencimento: '15/08/2032',
  },
];
