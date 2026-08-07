'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioFIIs } from '../../src/data/portfolio';

export default function FIIsPage() {
  const [filterSegmento, setFilterSegmento] = useState<string>('Todos');

  const totalInvestido = useMemo(() => {
    return portfolioFIIs.reduce((acc, item) => acc + item.quantidade * item.precoAtual, 0);
  }, []);

  const segmentosDisponiveis = useMemo(() => {
    const segmentos = Array.from(new Set(portfolioFIIs.map((f) => f.segmento)));
    return ['Todos', ...segmentos];
  }, []);

  const fiisFiltrados = useMemo(() => {
    if (filterSegmento === 'Todos') return portfolioFIIs;
    return portfolioFIIs.filter((f) => f.segmento === filterSegmento);
  }, [filterSegmento]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">
              FUNDOS IMOBILIÁRIOS (FIIs)
            </h1>
            <p className="text-xs text-[#8B949E]">
              Acompanhamento de proventos mensais e segmentos
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>TOTAL EM FIIs: </span>
            <span className="text-[#10B981] font-bold text-sm">
              R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Filtros por Segmento */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {segmentosDisponiveis.map((seg) => (
              <button
                key={seg}
                onClick={() => setFilterSegmento(seg)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  filterSegmento === seg
                    ? 'bg-[#10B981] text-[#0B0E14]'
                    : 'bg-[#151922] text-[#8B949E] border border-[#2A2F3D] hover:text-[#F1F5F9]'
                }`}
              >
                {seg}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#8B949E] font-mono">
            {fiisFiltrados.length} fundo(s) exibido(s)
          </span>
        </div>

        {/* Tabela de FIIs */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
                <tr>
                  <th className="px-4 py-3">Ticker / Fundo</th>
                  <th className="px-4 py-3">Segmento</th>
                  <th className="px-4 py-3 text-right">Qtd Cotas</th>
                  <th className="px-4 py-3 text-right">Preço Atual</th>
                  <th className="px-4 py-3 text-right">Preço Teto</th>
                  <th className="px-4 py-3 text-right">DY Mensal (%)</th>
                  <th className="px-4 py-3 text-right">Total Atual</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Research</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {fiisFiltrados.map((item) => {
                  const valorTotal = item.quantidade * item.precoAtual;
                  const dentroDoTeto = item.precoAtual <= item.precoTeto;

                  return (
                    <tr key={item.ticker} className="hover:bg-[#1A1F2B] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#F1F5F9]">{item.ticker}</div>
                        <div className="text-[10px] text-[#8B949E] font-sans">{item.nome}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-sans">
                        <span className="bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.segmento}
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
                        {item.dyMensal.toFixed(2)}%
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
