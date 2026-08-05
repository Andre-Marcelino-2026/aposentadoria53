'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { initialAssets } from '../../src/data/initialState';
import { updateAssetsWithPrices } from '../../src/api/stockApi';

export default function EtfsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para controlar a ordenação da tabela
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      const updated = await updateAssetsWithPrices(initialAssets);
      // FILTRO: Pega ativos da classe ETF ou BDR
      const filtered = updated.filter(
        (item) => item.asset?.assetClass === 'ETF' || item.asset?.assetClass === 'BDR'
      );
      setAssets(filtered);
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

  // Lógica de Ordenação
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
      <span className="text-[#F43F5E] ml-1">▲</span>
    ) : (
      <span className="text-[#F43F5E] ml-1">▼</span>
    );
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#F43F5E]">
              CARTEIRA DE ETFs & BDRs
            </h1>
            <p className="text-xs text-[#8B949E]">
              Visão detalhada e performance de Índices e Ativos Internacionais
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
              Patrimônio em ETFs & BDRs
            </p>
            <p className="text-[#F43F5E] text-2xl font-bold font-mono">
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

        {/* Tabela Exclusiva de ETFs & BDRs */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14] select-none">
                <tr>
                  <th 
                    className="px-4 py-3 rounded-tl cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('ticker')}
                  >
                    Ticker <SortIcon columnKey="ticker" />
                  </th>
                  <th 
                    className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('nome')}
                  >
                    Nome <SortIcon columnKey="nome" />
                  </th>
                  <th 
                    className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('classe')}
                  >
                    Classe <SortIcon columnKey="classe" />
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('qtd')}
                  >
                    <SortIcon columnKey="qtd" /> Qtd
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('cotacao')}
                  >
                    <SortIcon columnKey="cotacao" /> Cotação
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('variacao')}
                  >
                    <SortIcon columnKey="variacao" /> Variação (Dia)
                  </th>
                  <th 
                    className="px-4 py-3 text-right rounded-tr cursor-pointer hover:bg-[#1A1F2B] transition-colors"
                    onClick={() => handleSort('valorTotal')}
                  >
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
                    <td className="px-4 py-3 text-xs text-[#F43F5E] font-sans">
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
