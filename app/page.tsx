'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../src/components/layout/Sidebar';
import { portfolioAcoes, portfolioFIIs, portfolioRendaFixa, userProfile, TAXA_SELIC_ANUAL } from '../src/data/portfolio';

const BRAPI_TOKEN = 'oirG1gyFEtXo7ubChNnZgK';

type SortField = 'ticker' | 'classe' | 'cotacao' | 'varPct' | 'total';
type SortOrder = 'asc' | 'desc';
type FilterClass = 'TODOS' | 'AÇÕES' | 'ETFs' | 'FII' | 'RENDA FIXA';

export default function DashboardPage() {
  const [realTimeData, setRealTimeData] = useState<Record<string, { price: number; changeAbs: number; changePct: number }>>({});
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState<SortField>('total');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterClass, setFilterClass] = useState<FilterClass>('TODOS');

  useEffect(() => {
    const fetchBrapi = async () => {
      try {
        const tickersRV = [...portfolioAcoes, ...portfolioFIIs]
          .map((item) => item.ticker)
          .filter((t) => !t.endsWith('13') && !t.endsWith('12') && !t.endsWith('14'));

        if (tickersRV.length === 0) {
          setLoading(false);
          return;
        }

        const newData: Record<string, { price: number; changeAbs: number; changePct: number }> = {};

        await Promise.all(
          tickersRV.map(async (ticker) => {
            try {
              const res = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${BRAPI_TOKEN}`);
              const data = await res.json();
              if (data && data.results && data.results.length > 0) {
                const item = data.results[0];
                newData[ticker] = {
                  price: item.regularMarketPrice || 0,
                  changeAbs: item.regularMarketChange || 0,
                  changePct: item.regularMarketChangePercent || 0,
                };
              }
            } catch (err) {
              // Falha silenciosa
            }
          })
        );
        
        setRealTimeData(newData);
      } catch (error) {
        console.error('Erro geral ao conectar com Brapi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrapi();
  }, []);

  const taxaDiariaSelic = Math.pow(1 + TAXA_SELIC_ANUAL / 100, 1 / 252) - 1;

  const listaConsolidada = useMemo(() => {
    const rv = [...portfolioAcoes, ...portfolioFIIs].map(item => {
      // Inteligência para separar Ações de ETFs
      let classeNome = 'FII';
      if (portfolioAcoes.includes(item as any)) {
        classeNome = item.nome.includes('ETF') ? 'ETFs' : 'AÇÕES';
      }

      return {
        ticker: item.ticker,
        nome: item.nome,
        classe: classeNome,
        qtd: item.quantidade,
        cotacao: realTimeData[item.ticker]?.price || item.precoAtual,
        varPct: realTimeData[item.ticker]?.changePct || 0,
        varAbs: realTimeData[item.ticker]?.changeAbs || 0,
        total: item.quantidade * (realTimeData[item.ticker]?.price || item.precoAtual)
      };
    });

    const rf = portfolioRendaFixa.map(item => ({
      ticker: item.nome,
      nome: item.instituicao,
      classe: 'RENDA FIXA',
      qtd: item.quantidade,
      cotacao: item.valorAtual / (item.quantidade || 1),
      varPct: taxaDiariaSelic * 100,
      varAbs: item.valorAtual * taxaDiariaSelic,
      total: item.valorAtual
    }));

    let lista = [...rv, ...rf];

    if (filterClass !== 'TODOS') {
      lista = lista.filter(item => item.classe === filterClass);
    }

    return lista.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [realTimeData, taxaDiariaSelic, sortField, sortOrder, filterClass]);

  const patrimonioDinamico = listaConsolidada.reduce((acc, item) => acc + item.total, 0);
  const variacaoDinamicaAbs = listaConsolidada.reduce((acc, item) => acc + item.varAbs, 0);
  const variacaoDinamicaPct = patrimonioDinamico > 0 ? (variacaoDinamicaAbs / (patrimonioDinamico - variacaoDinamicaAbs)) * 100 : 0;
  
  const rendaPassivaProjetada = patrimonioDinamico * 0.008; 
  const progressoMeta = Math.min((rendaPassivaProjetada / userProfile.targetMonthlyPassiveIncome) * 100, 100);
  const isAlta = variacaoDinamicaAbs >= 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-[#4B5563] ml-1 text-[10px]">⇅</span>;
    return <span className="text-[#10B981] ml-1 text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F5F9]">DASHBOARD EXECUTIVO</h1>
            <p className="text-xs md:text-sm text-[#8B949E]">Projeto Aposentadoria 53 • Visão Consolidada</p>
          </div>
          <div className="text-right text-[10px] md:text-xs text-[#10B981] font-mono border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-1 rounded">
            {loading ? 'Sincronizando B3...' : 'STATUS: ONLINE'}
          </div>
        </div>

        {/* Top Cards Dinâmicos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 md:p-6 shadow-lg flex flex-col justify-between transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] md:text-[11px] text-[#8B949E] uppercase tracking-wider mb-1">
                  Rendimento {filterClass === 'TODOS' ? 'Consolidado' : `(${filterClass})`} Hoje
                </p>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <span className={`text-xl md:text-2xl font-bold font-mono transition-colors ${isAlta ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    R$ {isAlta ? '+' : ''}{variacaoDinamicaAbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-bold transition-colors ${isAlta ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {isAlta ? '▲' : '▼'} {variacaoDinamicaPct.toFixed(2)}%
                  </span>
                </div>
                <p className="text-[9px] md:text-[10px] text-[#8B949E] mt-2">
                  {filterClass === 'TODOS' || filterClass === 'RENDA FIXA' ? `*Inclui simulação RF (Selic ${TAXA_SELIC_ANUAL}% a.a.)` : '*Valores baseados no fecho/ao vivo da B3'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] md:text-[11px] text-[#8B949E] uppercase tracking-wider mb-1">
                  Patrimônio {filterClass !== 'TODOS' && 'Filtrado'}
                </p>
                <span className="text-xl md:text-2xl font-bold font-mono text-[#F1F5F9] transition-all">
                  R$ {patrimonioDinamico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 md:p-6 shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] md:text-[11px] text-[#8B949E] uppercase tracking-wider font-bold">
                Contribuição para Meta Aposentadoria
              </p>
            </div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] md:text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">Renda Passiva (0,8% a.m.)</p>
                <span className="text-lg md:text-xl font-bold font-mono text-[#3B82F6] transition-all">
                  R$ {rendaPassivaProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[9px] md:text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">Meta Mensal</p>
                <span className="text-lg md:text-xl font-bold font-mono text-[#F1F5F9]">
                  R$ {userProfile.targetMonthlyPassiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="w-full bg-[#0B0E14] rounded-full h-2 md:h-2.5 mt-2 overflow-hidden border border-[#2A2F3D]">
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-2 md:h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressoMeta}%` }}></div>
            </div>
            <p className="text-right text-[9px] md:text-[10px] font-bold text-[#10B981] mt-2 transition-all">
              {progressoMeta.toFixed(1)}% CONCLUÍDO
            </p>
          </div>
        </div>

        {/* Tabela Consolidada */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded shadow-lg overflow-hidden">
          <div className="px-4 py-3 md:px-5 md:py-4 border-b border-[#2A2F3D] bg-[#0B0E14] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#F1F5F9]">CARTEIRA CONSOLIDADA GERAL</h2>
              <p className="text-[10px] md:text-xs text-[#8B949E]">Clique no cabeçalho para ordenar ⇅</p>
            </div>
            
            <div className="flex space-x-1 bg-[#1A1F2B] p-1 rounded border border-[#2A2F3D] overflow-x-auto w-full md:w-auto hide-scrollbar">
              {(['TODOS', 'AÇÕES', 'ETFs', 'FII', 'RENDA FIXA'] as FilterClass[]).map((filtro) => (
                <button
                  key={filtro}
                  onClick={() => setFilterClass(filtro)}
                  className={`flex-1 md:flex-none px-3 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap ${
                    filterClass === filtro
                      ? 'bg-[#3B82F6] text-[#FFFFFF]'
                      : 'text-[#8B949E] hover:text-[#F1F5F9] hover:bg-[#2A2F3D]'
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto p-4 md:p-5">
            <table className="w-max md:w-full text-left text-xs md:text-sm whitespace-nowrap">
              <thead className="text-[9px] md:text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D]">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-3 cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('ticker')}>
                    Ativo {renderSortIcon('ticker')}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('classe')}>
                    Classe {renderSortIcon('classe')}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('cotacao')}>
                    Cotação/Ref {renderSortIcon('cotacao')}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('varPct')}>
                    Var (Dia) {renderSortIcon('varPct')}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('total')}>
                    Valor Total (R$) {renderSortIcon('total')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {listaConsolidada.length > 0 ? (
                  listaConsolidada.map((item, idx) => {
                    const alta = item.varPct >= 0;
                    return (
                      <tr key={idx} className="hover:bg-[#1A1F2B] transition-colors">
                        <td className="px-2 md:px-4 py-2 md:py-3">
                          <div className="font-bold text-[#F1F5F9]">{item.ticker}</div>
                          <div className="text-[9px] md:text-[10px] text-[#8B949E] font-sans truncate max-w-[100px] md:max-w-[120px]">{item.nome}</div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-sans text-[#3B82F6]">{item.classe}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right text-[#F1F5F9]">R$ {item.cotacao.toFixed(2)}</td>
                        <td className={`px-2 md:px-4 py-2 md:py-3 text-right font-bold ${alta ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {alta ? '▲' : '▼'} {Math.abs(item.varPct).toFixed(2)}%
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-right font-bold text-[#F1F5F9]">
                          R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-2 md:px-4 py-6 md:py-8 text-center text-[#8B949E] font-sans text-xs">
                      Nenhum ativo encontrado nesta classe.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
