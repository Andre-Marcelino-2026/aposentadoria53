'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { initialAssets } from '../../src/data/initialState';
import { updateAssetsWithPrices } from '../../src/api/stockApi';

export default function AportesPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aporteValue, setAporteValue] = useState<number>(2000);
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

  const totalPatrimony = useMemo(() => {
    return assets.reduce((acc, item) => acc + (item.currentValue || 0), 0);
  }, [assets]);

  // Lógica de recomendação de aportes focada nos ativos com menor patrimônio acumulado
  const recommendations = useMemo(() => {
    if (totalPatrimony === 0 || assets.length === 0) return [];

    const sortedByValue = [...assets].sort((a, b) => (a.currentValue || 0) - (b.currentValue || 0));
    const targetPerAsset = aporteValue / Math.min(5, sortedByValue.length);

    return sortedByValue.slice(0, 5).map((item) => {
      const price = item.currentPrice || 10;
      const suggestedQty = Math.floor(targetPerAsset / price);
      const suggestedTotal = suggestedQty * price;

      return {
        ticker: item.asset?.ticker || '-',
        name: item.asset?.name || '-',
        class: item.asset?.assetClass || '-',
        currentPrice: price,
        suggestedQty,
        suggestedTotal,
      };
    });
  }, [assets, totalPatrimony, aporteValue]);

  // Ordenação da Tabela
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecommendations = useMemo(() => {
    let items = [...recommendations];
    if (sortConfig !== null) {
      items.sort((a: any, b: any) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [recommendations, sortConfig]);

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
            <h1 className="text-xl font-bold tracking-tight text-[#3B82F6]">
              CALCULADORA DE APORTES & REBALANCEAMENTO
            </h1>
            <p className="text-xs text-[#8B949E]">
              Inteligência de alocação para manter sua carteira no alvo
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>STATUS: </span>
            <span className="text-[#10B981] font-bold">
              {loading ? 'CALCULANDO...' : 'PRONTO'}
            </span>
          </div>
        </div>

        {/* Input de Novo Aporte */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg flex flex-wrap justify-between items-center gap-4">
          <div>
            <label className="text-xs text-[#8B949E] uppercase tracking-wider block mb-1">
              Quanto deseja investir hoje? (R$)
            </label>
            <input
              type="number"
              value={aporteValue}
              onChange={(e) => setAporteValue(Number(e.target.value))}
              className="bg-[#0B0E14] border border-[#2A2F3D] rounded px-4 py-2 text-xl font-bold font-mono text-[#3B82F6] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8B949E] uppercase tracking-wider block">Patrimônio Projeção</span>
            <span className="text-xl font-bold font-mono text-[#10B981]">
              R$ {(totalPatrimony + aporteValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Sugestão de Compra Inteligente */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide mb-4">
            RECOMENDAÇÃO DE COMPRA PARA MANTER O EQUILÍBRIO
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14] select-none">
                <tr>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('ticker')}>
                    Ticker <SortIcon columnKey="ticker" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('name')}>
                    Nome <SortIcon columnKey="name" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('class')}>
                    Classe <SortIcon columnKey="class" />
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('currentPrice')}>
                    <SortIcon columnKey="currentPrice" /> Cotação Atual
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('suggestedQty')}>
                    <SortIcon columnKey="suggestedQty" /> Qtd Recomendada
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('suggestedTotal')}>
                    <SortIcon columnKey="suggestedTotal" /> Total a Comprar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {sortedRecommendations.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1F2B] transition-colors">
                    <td className="px-4 py-3 font-bold text-[#F1F5F9]">{rec.ticker}</td>
                    <td className="px-4 py-3 text-[#8B949E] font-sans text-xs">{rec.name}</td>
                    <td className="px-4 py-3 text-xs text-[#3B82F6] font-sans">{rec.class}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">R$ {rec.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-[#10B981] font-bold">+{rec.suggestedQty}</td>
                    <td className="px-4 py-3 text-right text-[#10B981] font-bold">
                      R$ {rec.suggestedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
