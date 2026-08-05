'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';

// Base de dados simulada com indicadores fundamentalistas de valuation
const mockValuationData = [
  { ticker: 'BBSE3', name: 'BB Seguridade', class: 'AÇÕES', price: 41.44, pl: 9.8, pvp: 5.2, dy: 9.1, roe: 53.4, margin: 82.1, status: 'Barato' },
  { ticker: 'ITSA4', name: 'Itaúsa', class: 'AÇÕES', price: 10.15, pl: 7.2, pvp: 1.1, dy: 8.4, roe: 16.2, margin: 18.5, status: 'Barato' },
  { ticker: 'TAEE11', name: 'Taesa', class: 'AÇÕES', price: 35.80, pl: 10.4, pvp: 1.8, dy: 9.8, roe: 17.5, margin: 44.2, status: 'Justo' },
  { ticker: 'KLBN3', name: 'Klabin', class: 'AÇÕES', price: 4.20, pl: 11.1, pvp: 2.3, dy: 7.2, roe: 20.1, margin: 15.8, status: 'Justo' },
  { ticker: 'PRIO3', name: 'PRIO', class: 'AÇÕES', price: 48.90, pl: 8.5, pvp: 2.4, dy: 2.1, roe: 28.3, margin: 41.0, status: 'Barato' },
  { ticker: 'SHUL4', name: 'Schulz', class: 'AÇÕES', price: 4.53, pl: 6.8, pvp: 1.2, dy: 5.4, roe: 17.8, margin: 10.2, status: 'Barato' },
  { ticker: 'MXRF11', name: 'Maxi Renda', class: 'FII', price: 10.20, pl: 0, pvp: 1.02, dy: 12.3, roe: 0, margin: 0, status: 'Justo' },
  { ticker: 'HGLG11', name: 'CSHG Logística', class: 'FII', price: 162.50, pl: 0, pvp: 0.98, dy: 8.6, roe: 0, margin: 0, status: 'Barato' },
  { ticker: 'IVVB11', name: 'iShares S&P 500', class: 'ETF', price: 310.00, pl: 24.5, pvp: 4.1, dy: 1.2, roe: 19.5, margin: 14.0, status: 'Esticado' },
];

export default function ValuationPage() {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const avgPL = useMemo(() => {
    const acoes = mockValuationData.filter((i) => i.pl > 0);
    return acoes.reduce((acc, i) => acc + i.pl, 0) / acoes.length;
  }, []);

  const avgPVP = useMemo(() => {
    return mockValuationData.reduce((acc, i) => acc + i.pvp, 0) / mockValuationData.length;
  }, []);

  const avgDY = useMemo(() => {
    return mockValuationData.reduce((acc, i) => acc + i.dy, 0) / mockValuationData.length;
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let items = [...mockValuationData];
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
  }, [sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <span className="text-[#2A2F3D] ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? (
      <span className="text-[#EAB308] ml-1">▲</span>
    ) : (
      <span className="text-[#EAB308] ml-1">▼</span>
    );
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#EAB308]">
              VALUATION & RESEARCH
            </h1>
            <p className="text-xs text-[#8B949E]">
              Análise de Indicadores Fundamentalistas e Múltiplos de Mercado
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>STATUS: </span>
            <span className="text-[#10B981] font-bold">MONITORANDO</span>
          </div>
        </div>

        {/* Cards de Resumo Fundamentalista */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              P/L Médio (Ações)
            </p>
            <p className="text-[#EAB308] text-2xl font-bold font-mono">
              {avgPL.toFixed(1)}x
            </p>
          </div>
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              P/VP Médio da Carteira
            </p>
            <p className="text-[#3B82F6] text-2xl font-bold font-mono">
              {avgPVP.toFixed(2)}x
            </p>
          </div>
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Dividend Yield (DY) Médio
            </p>
            <p className="text-[#10B981] text-2xl font-bold font-mono">
              {avgDY.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Tabela de Indicadores com Ordenação */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide mb-4">
            MÚLTIPLOS FUNDAMENTALISTAS DA CARTEIRA
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
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('price')}>
                    <SortIcon columnKey="price" /> Preço
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('pl')}>
                    <SortIcon columnKey="pl" /> P/L
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('pvp')}>
                    <SortIcon columnKey="pvp" /> P/VP
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('dy')}>
                    <SortIcon columnKey="dy" /> DY (%)
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('roe')}>
                    <SortIcon columnKey="roe" /> ROE (%)
                  </th>
                  <th className="px-4 py-3 text-center cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('status')}>
                    <SortIcon columnKey="status" /> Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {sortedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1F2B] transition-colors">
                    <td className="px-4 py-3 font-bold text-[#F1F5F9]">{item.ticker}</td>
                    <td className="px-4 py-3 text-[#8B949E] font-sans text-xs">{item.name}</td>
                    <td className="px-4 py-3 text-xs text-[#3B82F6] font-sans">{item.class}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">R$ {item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.pl > 0 ? `${item.pl}x` : '-'}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.pvp.toFixed(2)}x</td>
                    <td className="px-4 py-3 text-right text-[#10B981] font-bold">{item.dy.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.roe > 0 ? `${item.roe}%` : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold font-sans ${
                          item.status === 'Barato'
                            ? 'bg-[#10B981]/10 text-[#10B981]'
                            : item.status === 'Justo'
                            ? 'bg-[#EAB308]/10 text-[#EAB308]'
                            : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}
                      >
                        {item.status}
                      </span>
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
