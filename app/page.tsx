'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../src/components/layout/Sidebar';
import { initialAssets, userProfile } from '../src/data/initialState';
import { updateAssetsWithPrices } from '../src/api/stockApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Home() {
  const [assets, setAssets] = useState<any[]>(initialAssets);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para controlar a ordenação da tabela consolidada
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      const updated = await updateAssetsWithPrices(initialAssets);
      setAssets(updated);
      setLoading(false);
    }

    loadPrices();
  }, []);

  // --- CÁLCULOS REAIS DO DASHBOARD ---
  const totalPatrimony = assets.reduce(
    (acc, item) => acc + (item.currentValue || 0),
    0
  );
  const estimatedIncome = totalPatrimony * 0.008;
  const percentComplete = (
    (estimatedIncome / userProfile.targetMonthlyPassiveIncome) *
    100
  ).toFixed(1);

  // --- CÁLCULO DE RENDIMENTO DO DIA (EM R$ E %) ---
  const totalDailyChangeValue = assets.reduce((acc, item) => {
    const currentValue = item.currentValue || 0;
    const changePercent = item.dailyChangePercent || 0;
    // Estima o ganho/perda em R$ do ativo no dia
    const previousValue = currentValue / (1 + changePercent / 100);
    return acc + (currentValue - previousValue);
  }, 0);

  const totalDailyChangePercent = totalPatrimony > 0 
    ? (totalDailyChangeValue / (totalPatrimony - totalDailyChangeValue)) * 100 
    : 0;

  // --- LÓGICA DO GRÁFICO (DISTRIBUIÇÃO DA CARTEIRA) ---
  const assetAllocation = assets.reduce((acc, item) => {
    const assetClass = item.asset?.assetClass || 'OUTROS';
    const value = item.currentValue || 0;

    if (!acc[assetClass]) {
      acc[assetClass] = 0;
    }
    acc[assetClass] += value;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(assetAllocation).map((key) => ({
    name: key,
    value: assetAllocation[key],
  }));

  const COLORS: Record<string, string> = {
    AÇÕES: '#3B82F6',
    FII: '#8B5CF6',
    'RENDA FIXA': '#10B981',
    ETF: '#F43F5E',
    BDR: '#EAB308',
    IMÓVEIS: '#06B6D4',
    OUTROS: '#F97316',
  };

  // --- LÓGICA DE ORDENAÇÃO LOCAL ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssets = useMemo(() => {
    let sortableAssets = [...assets];
    if (sortConfig !== null) {
      sortableAssets.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'ticker': aValue = a.asset?.ticker; bValue = b.asset?.ticker; break;
          case 'nome': aValue = a.asset?.name; bValue = b.asset?.name; break;
          case 'classe': aValue = a.asset?.assetClass; bValue = b.asset?.assetClass; break;
          case 'qtd': aValue = a.currentQuantity; bValue = b.currentQuantity; break;
          case 'cotacao': aValue = a.currentPrice || 0; bValue = b.currentPrice || 0; break;
          case 'variacao': aValue = a.dailyChangePercent || 0; bValue = b.dailyChangePercent || 0; break;
          case 'valorTotal': aValue = a.currentValue || 0; bValue = b.currentValue || 0; break;
          default: return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableAssets;
  }, [assets, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <span className="text-[#2A2F3D] ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? (
      <span className="text-[#3B82F6] ml-1">▲</span>
    ) : (
      <span className="text-[#3B82F6] ml-1">▼</span>
    );
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              DASHBOARD EXECUTIVO
            </h1>
            <p className="text-xs text-[#8B949E]">
              Projeto Aposentadoria {userProfile.targetRetirementAge} • Visão Consolidada
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>STATUS: </span>
            <span className="text-[#10B981] font-bold">
              {loading ? 'ATUALIZANDO...' : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* --- CARD HIGHLIGHT: RESULTADO DO DIA --- */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-4 shadow-lg flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-xs text-[#8B949E] uppercase tracking-wider block">
              Rendimento Consolidado (Hoje)
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-2xl font-bold font-mono ${totalDailyChangeValue >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {totalDailyChangeValue >= 0 ? '+' : ''}
                R$ {totalDailyChangeValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${totalDailyChangePercent >= 0 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                {totalDailyChangePercent >= 0 ? '+' : ''}
                {totalDailyChangePercent.toFixed(2)}% {totalDailyChangePercent >= 0 ? '▲' : '▼'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8B949E] uppercase tracking-wider block">Patrimônio Total</span>
            <span className="text-xl font-bold font-mono text-[#F1F5F9]">
              R$ {totalPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* --- ÁREA DE RESUMO (META + GRÁFICO) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Aposentadoria */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide">
                  META APOSENTADORIA {userProfile.targetRetirementAge} ANOS
                </h2>
                <span className="text-[#8B949E] text-xs font-mono border border-[#2A2F3D] px-2 py-1 rounded bg-[#0B0E14]">
                  Idade: {userProfile.currentAge} / Meta: {userProfile.targetRetirementAge} anos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
                    Renda Passiva Projetada (0,8% a.m.)
                  </p>
                  <p className="text-[#3B82F6] text-2xl font-bold font-mono">
                    R${' '}
                    {estimatedIncome.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
                    Meta Mensal
                  </p>
                  <p className="text-[#F1F5F9] text-2xl font-bold font-mono">
                    R${' '}
                    {userProfile.targetMonthlyPassiveIncome.toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div>
              <div className="w-full h-3 bg-[#0B0E14] rounded-full overflow-hidden border border-[#2A2F3D]">
                <div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(Number(percentComplete), 100)}%`,
                  }}
                ></div>
              </div>
              <div className="text-right mt-2">
                <span className="text-xs text-[#10B981] font-mono font-bold">
                  {percentComplete}% CONCLUÍDO
                </span>
              </div>
            </div>
          </div>

          {/* Card Gráfico de Alocação */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide mb-4">
              DISTRIBUIÇÃO DA CARTEIRA
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name] || COLORS.OUTROS}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `R$ ${value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                    contentStyle={{
                      backgroundColor: '#1A1F2B',
                      borderColor: '#2A2F3D',
                      color: '#F1F5F9',
                      borderRadius: '4px',
                    }}
                    itemStyle={{ color: '#F1F5F9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {chartData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[entry.name] || COLORS.OUTROS,
                    }}
                  ></span>
                  <span className="text-xs text-[#8B949E] uppercase tracking-wider">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela Consolidada com Filtro */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide">
              CARTEIRA INICIAL CADASTRADA
            </h2>
            <span className="text-[#3B82F6] font-bold text-sm font-mono border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 rounded">
              PATRIMÔNIO TOTAL: R${' '}
              {totalPatrimony.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14] select-none">
                <tr>
                  <th className="px-4 py-3 rounded-tl cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('ticker')}>
                    Ticker <SortIcon columnKey="ticker" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('nome')}>
                    Nome <SortIcon columnKey="nome" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('classe')}>
                    Classe <SortIcon columnKey="classe" />
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('qtd')}>
                    <SortIcon columnKey="qtd" /> Qtd
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('cotacao')}>
                    <SortIcon columnKey="cotacao" /> Cotação
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('variacao')}>
                    <SortIcon columnKey="variacao" /> Variação (Dia)
                  </th>
                  <th className="px-4 py-3 text-right rounded-tr cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('valorTotal')}>
                    <SortIcon columnKey="valorTotal" /> Valor Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {sortedAssets.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#1A1F2B] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-[#F1F5F9]">
                      {item.asset?.ticker}
                    </td>
                    <td className="px-4 py-3 text-[#8B949E] font-sans text-xs">
                      {item.asset?.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#3B82F6] font-sans">
                      {item.asset?.assetClass}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">
                      {item.currentQuantity}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">
                      {item.currentPrice
                        ? `R$ ${item.currentPrice.toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.dailyChangePercent !== undefined ? (
                        item.dailyChangePercent > 0 ? (
                          <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded text-xs font-bold">
                            {`+${item.dailyChangePercent.toFixed(2)}% ▲`}
                          </span>
                        ) : item.dailyChangePercent < 0 ? (
                          <span className="text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded text-xs font-bold">
                            {`${item.dailyChangePercent.toFixed(2)}% ▼`}
                          </span>
                        ) : (
                          <span className="text-[#8B949E]">0.00% -</span>
                        )
                      ) : (
                        <span className="text-[#8B949E]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9] font-bold">
                      {item.currentValue
                        ? `R$ ${item.currentValue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
