'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioRendaFixa } from '../../src/data/portfolio';

type SortField = 'nome' | 'instituicao' | 'tipo' | 'valorAtual' | 'vencimento';
type SortOrder = 'asc' | 'desc';

export default function RendaFixaPage() {
  const [sortField, setSortField] = useState<SortField>('valorAtual');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Ordena a lista de acordo com a coluna selecionada
  const rendaFixaProcessada = useMemo(() => {
    return [...portfolioRendaFixa].sort((a, b) => {
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
  }, [sortField, sortOrder]);

  const totalRendaFixa = useMemo(() => {
    return portfolioRendaFixa.reduce((acc, item) => acc + item.valorAtual, 0);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-[#4B5563] ml-1">⇅</span>;
    return <span className="text-[#10B981] ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">RENDA FIXA & CAIXA</h1>
            <p className="text-xs text-[#8B949E]">
              Clique no cabeçalho de qualquer coluna para ordenar ⇅
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>TOTAL RENDA FIXA: </span>
            <span className="text-[#10B981] font-bold text-sm block">
              R$ {totalRendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Tabela Principal */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
              <tr>
                <th className="px-4 py-3 cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('nome')}>
                  Ativo / Aplicação {renderSortIcon('nome')}
                </th>
                <th className="px-4 py-3 cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('instituicao')}>
                  Instituição {renderSortIcon('instituicao')}
                </th>
                <th className="px-4 py-3 cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('tipo')}>
                  Tipo {renderSortIcon('tipo')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('valorAtual')}>
                  Valor Atual (R$) {renderSortIcon('valorAtual')}
                </th>
                <th className="px-4 py-3 text-center cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('vencimento')}>
                  Vencimento {renderSortIcon('vencimento')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2F3D] font-mono">
              {rendaFixaProcessada.map((item, index) => (
                <tr key={index} className="hover:bg-[#1A1F2B] transition-colors">
                  <td className="px-4 py-3 font-bold text-[#F1F5F9]">{item.nome}</td>
                  <td className="px-4 py-3 text-xs text-[#8B949E] font-sans">{item.instituicao}</td>
                  <td className="px-4 py-3 text-xs font-sans">
                    <span className="bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#F1F5F9]">
                    R$ {item.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[#8B949E] font-sans">{item.vencimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
