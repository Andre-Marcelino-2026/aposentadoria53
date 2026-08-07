// Base de Dados Unificada - Projeto Aposentadoria 53
// Consolidação Total: B3 (06/08/2026) + Itaú + Nubank + TRXF11 (5 cotas)

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
  tipo: 'Tesouro Direto' | 'CDB / RDB' | 'Fundo DI' | 'Previdência' | 'Caixinha/Cofrinho';
  quantidade: number;
  valorAplicado: number;
  valorAtual: number;
  vencimento: string;
  instituicao: string;
}

export interface UserProfile {
  targetMonthlyPassiveIncome: number;
  targetAllocations: {
    acoes: number;
    fiis: number;
    rendaFixa: number;
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

// Carteira Real de Ações (Posição B3 06/08/2026)
export const portfolioAcoes: Acao[] = [
  {
    ticker: 'AXIA3',
    nome: 'AXIA ENERGIA S.A. ON',
    quantidade: 122,
    precoAtual: 53.17,
    precoTeto: 62.00,
    categoria: 'Dividendos',
    dy: 7.2,
    research: 'Nord Research',
  },
  {
    ticker: 'AXIA7',
    nome: 'AXIA ENERGIA S.A. PNC',
    quantidade: 32,
    precoAtual: 52.93,
    precoTeto: 60.00,
    categoria: 'Dividendos',
    dy: 7.5,
    research: 'Nord Research',
  },
  {
    ticker: 'B3SA3',
    nome: 'B3 S.A. ON',
    quantidade: 360,
    precoAtual: 15.36,
    precoTeto: 16.50,
    categoria: 'Crescimento',
    dy: 4.8,
    research: 'Finclass',
  },
  {
    ticker: 'BBSE3',
    nome: 'BB SEGURIDADE ON',
    quantidade: 103,
    precoAtual: 40.96,
    precoTeto: 36.00,
    categoria: 'Dividendos',
    dy: 8.9,
    research: 'Nord Research',
  },
  {
    ticker: 'BPAC11',
    nome: 'BCO BTG PACTUAL UNIT',
    quantidade: 142,
    precoAtual: 56.15,
    precoTeto: 58.00,
    categoria: 'Crescimento',
    dy: 2.5,
    research: 'Nord Research / Finclass',
  },
  {
    ticker: 'IRBR3',
    nome: 'IRB BRASIL ON',
    quantidade: 33,
    precoAtual: 47.98,
    precoTeto: 50.00,
    categoria: 'Crescimento',
    dy: 1.2,
    research: 'Carteira Própria',
  },
];

// Carteira Real de FIIs / Fundos (Posição B3 + 5 cotas TRXF11)
export const portfolioFIIs: FII[] = [
  {
    ticker: 'XPLG11',
    nome: 'XP LOG FDO INV IMOB',
    quantidade: 117,
    precoAtual: 94.60,
    precoTeto: 105.00,
    segmento: 'Logística',
    dyMensal: 0.82,
    research: 'Nord / Finclass',
  },
  {
    ticker: 'CPTI11',
    nome: 'CAPITÂNIA FDO. INV. FINANCEIRO',
    quantidade: 72,
    precoAtual: 84.71,
    precoTeto: 95.00,
    segmento: 'Papel / Crédito',
    dyMensal: 0.95,
    research: 'Finclass',
  },
  {
    ticker: 'TRXF11',
    nome: 'TRX REAL ESTATE FII',
    quantidade: 5,
    precoAtual: 85.91,
    precoTeto: 113.50,
    segmento: 'Varejo / Imóveis Urbanos',
    dyMensal: 1.82,
    research: 'Nord Research',
  },
];

// Carteira Real de Renda Fixa / Caixa (Tesouro + Itaú + Nubank)
export const portfolioRendaFixa: RendaFixa[] = [
  {
    nome: 'Tesouro IPCA+ 2029',
    tipo: 'Tesouro Direto',
    quantidade: 10.05,
    valorAplicado: 35029.13,
    valorAtual: 38312.90,
    vencimento: '15/05/2029',
    instituicao: 'Nu Investimentos S.A. - CTVM',
  },
  {
    nome: 'Caixinhas Nubank (RDB 100% CDI)',
    tipo: 'Caixinha/Cofrinho',
    quantidade: 1,
    valorAplicado: 60494.73,
    valorAtual: 60494.73,
    vencimento: 'Liquidez Diária',
    instituicao: 'Nubank',
  },
  {
    nome: 'Tesouro IPCA+ 2032',
    tipo: 'Tesouro Direto',
    quantidade: 3.41,
    valorAplicado: 10025.80,
    valorAtual: 10038.28,
    vencimento: '15/08/2032',
    instituicao: 'XP Investimentos CCTVM S/A',
  },
  {
    nome: 'Itaú Privilege DI',
    tipo: 'Fundo DI',
    quantidade: 1,
    valorAplicado: 61326.32,
    valorAtual: 61326.32,
    vencimento: 'Liquidez Diária',
    instituicao: 'Banco Itaú',
  },
  {
    nome: 'Cofrinho Itaú (100% CDI)',
    tipo: 'Caixinha/Cofrinho',
    quantidade: 1,
    valorAplicado: 7176.54,
    valorAtual: 7176.54,
    vencimento: 'Liquidez Diária',
    instituicao: 'Banco Itaú',
  },
  {
    nome: 'Previdência Itaú (Acompanha CDI)',
    tipo: 'Previdência',
    quantidade: 1,
    valorAplicado: 1044.97,
    valorAtual: 1044.97,
    vencimento: 'Longo Prazo',
    instituicao: 'Banco Itaú',
  },
];
