'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../src/components/layout/Sidebar';
import { initialAssets, userProfile } from '../src/data/initialState';
import { updateAssetsWithPrices } from '../src/api/stockApi';
// Importações novas da biblioteca recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Home() {
  const [assets, setAssets] = useState<any[]>(initialAssets);
  const [loading, setLoading] = useState<boolean>(true);

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

  // 3. Definir as cores do gráfico (AJUSTADO COM TODAS AS CLASSES DA SUA BASE)
  const COLORS: Record<string, string> = {
    AÇÕES: '#3B82F6', // Azul
    FII: '#8B5CF6', // Roxo
    'RENDA FIXA': '#10B981', // Verde
    ETF: '#F43F5E', // Rosa
    BDR: '#EAB308', // Amarelo
    IMÓVEIS: '#06B6D4', // Ciano
    OUTROS: '#F97316', // Laranja
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
              Projeto Aposentadoria {userProfile.targetRetirementAge} • Visão
              Consolidada
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>STATUS: </span>
            <span className="text-[#10B981] font-bold">
              {loading ? 'ATUALIZANDO...' : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* --- ÁREA DE RESUMO (META + GRÁFICO) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Aposentadoria (Esquerda) */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide">
                  META APOSENTADORIA {userProfile.targetRetirementAge} ANOS
                </h2>
                <span className="text-[#8B949E] text-xs font-mono border border-[#2A2F3D] px-2 py-1 rounded bg-[#0B0E14]">
                  Idade: {userProfile.currentAge} / Meta:{' '}
                  {userProfile.targetRetirementAge} anos
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

            {/* Barra de Progresso Real */}
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

          {/* Card Gráfico de Alocação (Direita) */}
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

            {/* Legenda Customizada */}
            <div className="flex justify-center gap-4 mt-2">
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

        {/* Tabela de Ativos da Carteira Real */}
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
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
                <tr>
                  <th className="px-4 py-3 rounded-tl">Ticker</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                  <th className="px-4 py-3 text-right">Cotação</th>
                  <th className="px-4 py-3 text-right">Variação (Dia)</th>
                  <th className="px-4 py-3 text-right rounded-tr">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {assets.map((item, idx) => (
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
