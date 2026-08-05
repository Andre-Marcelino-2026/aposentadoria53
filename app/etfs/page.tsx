'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { initialAssets } from '../../src/data/initialState';
import { updateAssetsWithPrices } from '../../src/api/stockApi';

export default function ETFsBDRsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      const updated = await updateAssetsWithPrices(initialAssets);
      // FILTRO: Pega apenas os ativos da classe ETF ou BDR
      const onlyEtfsBdrs = updated.filter(
        (item) =>
          item.asset?.assetClass === 'ETF' || item.asset?.assetClass === 'BDR'
      );
      setAssets(onlyEtfsBdrs);
      setLoading(false);
    }

    loadPrices();
  }, []);

  // Cálculos específicos para o resumo
  const totalInvested = assets.reduce(
    (acc, item) => acc + (item.currentValue || 0),
    0
  );

  const averageChange =
    assets.length > 0
      ? assets.reduce((acc, item) => acc + (item.dailyChangePercent || 0), 0) /
        assets.length
      : 0;

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#F97316]">
              CARTEIRA DE ETFs & BDRs
            </h1>
            <p className="text-xs text-[#8B949E]">
              Exposição internacional e fundos de índice
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>STATUS: </span>
            <span className="text-[#10B981] font-bold">
              {loading ? 'ATUALIZANDO...' : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Patrimônio (ETFs & BDRs)
            </p>
            <p className="text-[#F97316] text-2xl font-bold font-mono">
              R${' '}
              {totalInvested.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Desempenho Médio (Dia)
            </p>
            <p
              className={`text-2xl font-bold font-mono ${
                averageChange >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            >
              {averageChange > 0 ? '+' : ''}
              {averageChange.toFixed(2)}% {averageChange >= 0 ? '▲' : '▼'}
            </p>
          </div>
        </div>

        {/* Tabela Exclusiva */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
                <tr>
                  <th className="px-4 py-3 rounded-tl">Ticker</th>
                  <th className="px-4 py-3">Nome</th>
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
                            +{item.dailyChangePercent.toFixed(2)}% ▲
                          </span>
                        ) : item.dailyChangePercent < 0 ? (
                          <span className="text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded text-xs font-bold">
                            {item.dailyChangePercent.toFixed(2)}% ▼
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
