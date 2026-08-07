'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioAcoes } from '../../src/data/portfolio';

export default function AcoesPage() {
  const [filter, setFilter] = useState<'Todos' | 'Dividendos' | 'Crescimento'>('Todos');

  const totalInvestido = useMemo(() => {
    return portfolioAcoes.reduce((acc, item) => acc + item.quantidade * item.precoAtual, 0);
  }, []);

  const acoesFiltradas = useMemo(() => {
    if (filter === 'Todos') return portfolioAcoes;
    return portfolioAcoes.filter((a) => a.categoria === filter);
  }, [filter]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">
              CARTEIRA DE AÇÕES
            </h1>
            <p className="text-xs text-[#8B949E]">
              Gestão tática e acompanhamento de Preço Teto
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>TOTAL EM AÇÕES: </span>
            <span className="text-[#10B981] font-bold text-sm">
              R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Filtros e Contagem */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {(['Todos', 'Dividendos', 'Crescimento'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  filter === cat
                    ? 'bg-[#10B981] text-[#0B0E14]'
                    : 'bg-[#151922] text-[#8B949E] border border-[#2A2F3D] hover:text-[#F1F5F9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#8B949E] font-mono">
            {acoesFiltradas.length} ativo(s) exibido(s)
          </span>
        </div>

        {/* Tabela Principal de Ações */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
                <tr>
                  <th className="px-4 py-3">Ticker / Empresa</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                  <th className="px-4 py-3 text-right">Preço Atual</th>
                  <th className="px-4 py-3 text-right">Preço Teto</th>
                  <th className="px-4 py-3 text-right">DY (%)</th>
                  <th className="px-4 py-3 text-right">Total Atual</th>
                  <th className="px-4 py-3 text-center">Status / Margem</th>
                  <th className="px-4 py-3 text-center">Research</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {acoesFiltradas.map((item) => {
                  const valorTotal = item.quantidade * item.precoAtual;
                  const dentroDoTeto = item.precoAtual <= item.precoTeto;

                  return (
                    <tr key={item.ticker} className="hover:bg-[#1A1F2B] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#F1F5F9]">{item.ticker}</div>
                        <div className="text-[10px] text-[#8B949E] font-sans">{item.nome}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.categoria === 'Dividendos'
                              ? 'bg-[#10B981]/10 text-[#10B981]'
                              : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                          }`}
                        >
                          {item.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.quantidade}</td>
                      <td className="px-4 py-3 text-right text-[#F1F5F9]">
                        R$ {item.precoAtual.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#8B949E]">
                        R$ {item.precoTeto.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#10B981] font-bold">
                        {item.dy.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#F1F5F9]">
                        R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                            dentroDoTeto
                              ? 'bg-[#10B981]/10 text-[#10B981]'
                              : 'bg-[#EF4444]/10 text-[#EF4444]'
                          }`}
                        >
                          {dentroDoTeto ? 'Abaixo do Teto' : 'Acima do Teto'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-sans text-[#8B949E]">
                        {item.research}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
