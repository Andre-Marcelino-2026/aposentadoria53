// Base de Dados Unificada - Projeto Aposentadoria 53
// Consolidação Total Exata: Exportação B3 + Itaú + Nubank

export const TAXA_SELIC_ANUAL = 14.0; // Altere este valor sempre que o Banco Central mudar a taxa

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
  tipo: string;
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

// Carteira Real de Ações, BDRs e ETFs de Renda Variável (Posição B3 Exata)
export const portfolioAcoes: Acao[] = [
  // Ações
  { ticker: 'AXIA3', nome: 'AXIA ENERGIA S.A. ON', quantidade: 122, precoAtual: 53.17, precoTeto: 62.00, categoria: 'Dividendos', dy: 7.2, research: 'Nord Research' },
  { ticker: 'AXIA7', nome: 'AXIA ENERGIA S.A. PNC', quantidade: 31, precoAtual: 52.93, precoTeto: 60.00, categoria: 'Dividendos', dy: 7.5, research: 'Nord Research' },
  { ticker: 'B3SA3', nome: 'B3 S.A. ON', quantidade: 360, precoAtual: 15.36, precoTeto: 16.50, categoria: 'Crescimento', dy: 4.8, research: 'Finclass' },
  { ticker: 'BBSE3', nome: 'BB SEGURIDADE ON', quantidade: 103, precoAtual: 40.96, precoTeto: 36.00, categoria: 'Dividendos', dy: 8.9, research: 'Nord Research' },
  { ticker: 'BPAC11', nome: 'BCO BTG PACTUAL UNIT', quantidade: 142, precoAtual: 56.20, precoTeto: 58.00, categoria: 'Crescimento', dy: 2.5, research: 'Nord / Finclass' },
  { ticker: 'IRBR3', nome: 'IRB BRASIL ON', quantidade: 33, precoAtual: 52.74, precoTeto: 50.00, categoria: 'Crescimento', dy: 1.2, research: 'Carteira Própria' },
  { ticker: 'ITSA4', nome: 'ITAUSA S.A. PN', quantidade: 905, precoAtual: 13.51, precoTeto: 13.51, categoria: 'Dividendos', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'KLBN3', nome: 'KLABIN S.A. ON', quantidade: 1769, precoAtual: 3.68, precoTeto: 3.68, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'OIBR3', nome: 'OI S.A. ON', quantidade: 20, precoAtual: 0.12, precoTeto: 0.12, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'PRIO3', nome: 'PRIO S.A. ON', quantidade: 175, precoAtual: 58.61, precoTeto: 58.61, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'SHUL4', nome: 'SCHULZ S.A. PN', quantidade: 297, precoAtual: 4.48, precoTeto: 4.48, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'TAEE11', nome: 'TAESA S.A. UNIT', quantidade: 143, precoAtual: 39.54, precoTeto: 39.54, categoria: 'Dividendos', dy: 0.0, research: 'Carteira Própria' },
  // BDRs
  { ticker: 'INBR32', nome: 'INTER CO INC BDR', quantidade: 70, precoAtual: 28.92, precoTeto: 28.92, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  // ETFs de Renda Variável / Cripto
  { ticker: 'ACWI11', nome: 'TREND ETF ALL COUNTRIES', quantidade: 192, precoAtual: 17.25, precoTeto: 17.25, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'BOVA11', nome: 'ISHARES IBOVESPA ETF', quantidade: 30, precoAtual: 172.04, precoTeto: 172.04, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'DIVD11', nome: 'IT NOW IDIV RENDA ETF', quantidade: 40, precoAtual: 62.07, precoTeto: 62.07, categoria: 'Dividendos', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'DIVO11', nome: 'IT NOW IDIV ETF', quantidade: 732, precoAtual: 126.44, precoTeto: 126.44, categoria: 'Dividendos', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'HODL11', nome: 'INVESTO ETF BITCOIN', quantidade: 85, precoAtual: 55.33, precoTeto: 55.33, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
  { ticker: 'IVVB11', nome: 'ISHARES S&P 500 ETF', quantidade: 20, precoAtual: 443.95, precoTeto: 443.95, categoria: 'Crescimento', dy: 0.0, research: 'Carteira Própria' },
];

// Carteira Real de FIIs / Fundos (Posição B3 Exata)
export const portfolioFIIs: FII[] = [
  { ticker: 'HSML11', nome: 'HSI MALLS FII', quantidade: 568, precoAtual: 83.57, precoTeto: 96.00, segmento: 'Shopping', dyMensal: 0.82, research: 'Nord Research' },
  { ticker: 'MXRF11', nome: 'MAXI RENDA FII', quantidade: 4690, precoAtual: 9.43, precoTeto: 9.43, segmento: 'Papel / Crédito', dyMensal: 1.00, research: 'Carteira Própria' },
  { ticker: 'TRXF11', nome: 'TRX REAL ESTATE FII', quantidade: 156, precoAtual: 84.41, precoTeto: 113.50, segmento: 'Varejo / Logística', dyMensal: 0.85, research: 'Nord Research' },
  { ticker: 'TRXF12', nome: 'TRX REAL ESTATE (DIREITO)', quantidade: 123, precoAtual: 0.00, precoTeto: 0.00, segmento: 'Direitos', dyMensal: 0.00, research: 'Carteira Própria' },
  { ticker: 'VGIR11', nome: 'VALORA CRI CDI FII', quantidade: 1215, precoAtual: 9.52, precoTeto: 9.55, segmento: 'Papel / Crédito', dyMensal: 1.00, research: 'Nord Research' },
  { ticker: 'XPLG11', nome: 'XP LOG FII', quantidade: 117, precoAtual: 90.83, precoTeto: 105.00, segmento: 'Logística', dyMensal: 0.80, research: 'Nord / Finclass' },
  { ticker: 'CPTI11', nome: 'CAPITÂNIA FDO INV FINANCEIRO', quantidade: 72, precoAtual: 84.71, precoTeto: 95.00, segmento: 'Infraestrutura / RF', dyMensal: 0.95, research: 'Finclass' },
];

// Carteira Real de Renda Fixa / Caixa (B3 + Itaú + Nubank)
export const portfolioRendaFixa: RendaFixa[] = [
  // Títulos e ETFs Custodiados na B3 (XP / NuInvest)
  { nome: 'Tesouro IPCA+ 2029', tipo: 'Tesouro Direto', quantidade: 10.05, valorAplicado: 35029.13, valorAtual: 38499.33, vencimento: '15/05/2029', instituicao: 'NU INVESTIMENTOS S.A.' },
  { nome: 'Tesouro IPCA+ 2032', tipo: 'Tesouro Direto', quantidade: 3.41, valorAplicado: 10025.80, valorAtual: 10072.93, vencimento: '15/08/2032', instituicao: 'XP INVESTIMENTOS' },
  { nome: 'CDB ITAU B255HRWE', tipo: 'CDB B3', quantidade: 1, valorAplicado: 7313.02, valorAtual: 7339.50, vencimento: '14/10/2030', instituicao: 'XP INVESTIMENTOS' },
  { nome: 'CDB ITAU 726BONEG', tipo: 'CDB B3', quantidade: 1, valorAplicado: 10097.42, valorAtual: 6092.48, vencimento: '21/07/2031', instituicao: 'XP INVESTIMENTOS' },
  { nome: 'B5P211 (ETF Renda Fixa)', tipo: 'ETF RF', quantidade: 52, valorAplicado: 5694.52, valorAtual: 5694.52, vencimento: 'Indeterminado', instituicao: 'XP INVESTIMENTOS' },
  
  // Saldos Bancários (Nubank)
  { nome: 'Caixinhas Nubank (RDB)', tipo: 'Caixinha/Cofrinho', quantidade: 1, valorAplicado: 60494.73, valorAtual: 60494.73, vencimento: 'Liquidez Diária', instituicao: 'Nubank' },
  
  // Saldos Bancários (Itaú)
  { nome: 'Itaú Privilege DI', tipo: 'Fundo DI', quantidade: 1, valorAplicado: 61326.32, valorAtual: 61326.32, vencimento: 'Liquidez Diária', instituicao: 'Banco Itaú' },
  { nome: 'Cofrinho Itaú (100% CDI)', tipo: 'Caixinha/Cofrinho', quantidade: 1, valorAplicado: 7176.54, valorAtual: 7176.54, vencimento: 'Liquidez Diária', instituicao: 'Banco Itaú' },
  { nome: 'Previdência Itaú', tipo: 'Previdência', quantidade: 1, valorAplicado: 1044.97, valorAtual: 1044.97, vencimento: 'Longo Prazo', instituicao: 'Banco Itaú' },
];
