'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { userProfile } from '../../src/data/initialState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const mockDividendHistory = [
  { month: 'Jan', amount: 1450.20 },
  { month: 'Fev', amount: 1680.50 },
  { month: 'Mar', amount: 1520.00 },
  { month: 'Abr', amount: 1890.30 },
  { month: 'Mai', amount: 2100.40 },
  { month: 'Jun', amount: 1950.80 },
  { month: 'Jul', amount: 2340.10 },
  { month: 'Ago', amount: 2599.47 },
];

const mockRecentDividends = [
  { id: 1, ticker: 'BBSE3', type: 'Dividendo', payDate: '15/08/2026', rate: 1.25, quantity: 103, total: 128.75 },
  { id: 2, ticker: 'ITSA4', type: 'JCP', payDate: '20/08/2026', rate: 0.18, quantity: 905, total: 162.90 },
  { id: 3, ticker: 'TAEE11', type: 'Dividendo', payDate: '29/08/2026', rate: 0.98, quantity: 143, total: 140.14 },
  { id: 4, ticker: 'KLBN3', type: 'Dividendo', payDate: '05/09/2026', rate: 0.12, quantity: 1769, total: 212.28 },
  { id: 5, ticker: 'PRIO3', type: 'JCP', payDate: '12/09/2026', rate: 0.45, quantity: 175, total: 78.75 },
];

export default function DividendosPage() {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const totalYear = useMemo(() => {
    return mockDividendHistory.reduce((acc, item) => acc + item.amount, 0);
  }, []);

  const monthlyAverage = useMemo(() => {
    return totalYear / mockDividendHistory.length;
  }, [totalYear]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDividends = useMemo(() => {
    let items = [...mockRecentDividends];
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
      <span className="text-[#10B981] ml-1">▲</span>
    ) : (
      <span className="text-[#10B981] ml-1">▼</span>
    );
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">
              GESTOR DE DIVIDENDOS
            </h1>
            <p className="text-xs text-[#8B949E]">
              Acompanhamento de Renda Passiva e Fluxo de Caixa Projetado
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>META MENSAL: </span>
            <span className="text-[#10B981] font-bold">
              R$ {userProfile.targetMonthlyPassiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Total Recebido (Ano)
            </p>
            <p className="text-[#10B981] text-2xl font-bold font-mono">
              R$ {totalYear.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Média Mensal
            </p>
            <p className="text-[#3B82F6] text-2xl font-bold font-mono">
              R$ {monthlyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Meta Concluída (Mês Atual)
            </p>
            <p className="text-[#F1F5F9] text-2xl font-bold font-mono">
              {((mockDividendHistory[mockDividendHistory.length - 1].amount / userProfile.targetMonthlyPassiveIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide mb-4">
            EVOLUÇÃO MENSAL DOS PROVENTOS (R$)
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDividendHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3D" vertical={false} />
                <XAxis dataKey="month" stroke="#8B949E" fontSize={12} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={12} tickLine={false} tickFormatter={(val) => `R$${val}`} />
                <Tooltip
                  formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#1A1F2B', borderColor: '#2A2F3D', color: '#F1F5F9' }}
                />
                <ReferenceLine
                  y={userProfile.targetMonthlyPassiveIncome}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Meta: R$ 5.000', fill: '#EF4444', fontSize: 10, position: 'top' }}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <h2 className="text-[#F1F5F9] font-bold text-sm tracking-wide mb-4">
            PROVENTOS CONFIRMADOS & ANUNCIADOS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14] select-none">
                <tr>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('ticker')}>
                    Ticker <SortIcon columnKey="ticker" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('type')}>
                    Tipo <SortIcon columnKey="type" />
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('payDate')}>
                    Data Pagamento <SortIcon columnKey="payDate" />
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('rate')}>
                    <SortIcon columnKey="rate" /> Valor / Cota
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('quantity')}>
                    <SortIcon columnKey="quantity" /> Qtd
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:bg-[#1A1F2B]" onClick={() => handleSort('total')}>
                    <SortIcon columnKey="total" /> Total Recebido
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {sortedDividends.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A1F2B] transition-colors">
                    <td className="px-4 py-3 font-bold text-[#F1F5F9]">{item.ticker}</td>
                    <td className="px-4 py-3 text-xs text-[#3B82F6] font-sans">{item.type}</td>
                    <td className="px-4 py-3 text-[#8B949E] text-xs">{item.payDate}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">R$ {item.rate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-[#10B981] font-bold">
                      R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
