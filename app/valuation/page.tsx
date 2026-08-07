'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioAcoes, portfolioFIIs } from '../../src/data/portfolio';

export default function ValuationPage() {
  const [tipoFiltro, setTipoFiltro] = useState<'Todos' | 'Ações' | 'FIIs'>('Todos');
  const [statusFiltro, setStatusFiltro] = useState<'Todos' | 'Oportunidade' | 'Acima do Teto'>('Todos');

  // Unifica a lista de Ações e FIIs em uma visão consolidada de Valuation
  const todosAtivos = useMemo(() => {
    const acoesMapped = portfolioAcoes.map((a) => ({
      ticker: a.ticker,
      nome: a.nome,
      tipo: 'Ação' as const,
      precoAtual: a.precoAtual,
      precoTeto: a.precoTeto,
      dy: a.dy,
      research: a.research,
      desconto: ((a.precoTeto - a.precoAtual) / a.precoTeto) * 100,
    }));

    const fiisMapped = portfolioFIIs.map((f) => ({
      ticker: f.ticker,
      nome: f.nome,
      tipo: 'FII' as const,
      precoAtual: f.precoAtual,
      precoTeto: f.precoTeto,
      dy: f.dyMensal * 12, // Anualizado para comparação
      research: f.research,
      desconto: ((f.precoTeto - f.precoAtual) / f.precoTeto) * 100,
    }));

    return [...acoesMapped, ...fiisMapped];
  }, []);

  // Aplicação dos filtros dinâmicos
  const ativosFiltrados = useMemo(() => {
    return todosAtivos.filter((item) => {
      const passaTipo = tipoFiltro === 'Todos' || (tipoFiltro === 'Ações' && item.tipo === 'Ação') || (tipoFiltro === 'FIIs' && item.tipo === 'FII');
      const dentroDoTeto = item.precoAtual <= item.precoTeto;
      const passaStatus =
        statusFiltro === 'Todos' ||
        (statusFiltro === 'Oportunidade' && dentroDoTeto) ||
        (statusFiltro === 'Acima do Teto' && !dentroDoTeto);

      return passaTipo && passaStatus;
    });
  }, [todosAtivos, tipoFiltro, statusFiltro]);

  // Total de ativos em oportunidade (Abaixo do Teto)
  const qtdOportunidades = useMemo(() => {
    return todosAtivos.filter((a) => a.precoAtual <= a.precoTeto).length;
  }, [todosAtivos]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">
              VALUATION & RESEARCH
            </h1>
            <p className="text-xs text-[#8B949E]">
              Análise de Margem de Segurança e Preço Teto
            </p>
          </div>
          <div className="text-right font-mono text-xs">
            <span className="text-[#8B949E]">OPORTUNIDADES DE COMPRA: </span>
            <span className="text-[#10B981] font-bold text-sm">
              {qtdOportunidades} de {todosAtivos.length} ativos
            </span>
          </div>
        </div>

        {/* Bar de Filtros */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-[#151922] p-4 rounded border border-[#2A2F3D]">
          {/* Filtro por Tipo */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#8B949E] uppercase font-bold">Tipo:</span>
            {(['Todos', 'Ações', 'FIIs'] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoFiltro(tipo)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  tipoFiltro === tipo
                    ? 'bg-[#10B981] text-[#0B0E14]'
                    : 'bg-[#0B0E14] text-[#8B949E] border border-[#2A2F3D] hover:text-[#F1F5F9]'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* Filtro por Status */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#8B949E] uppercase font-bold">Status:</span>
            {(['Todos', 'Oportunidade', 'Acima do Teto'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFiltro === st
                    ? 'bg-[#3B82F6] text-[#FFFFFF]'
                    : 'bg-[#0B0E14] text-[#8B949E] border border-[#2A2F3D] hover:text-[#F1F5F9]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela Principal de Valuation */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
                <tr>
                  <th className="px-4 py-3">Ativo</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3 text-right">Preço Atual</th>
                  <th className="px-4 py-3 text-right">Preço Teto</th>
                  <th className="px-4 py-3 text-right">Margem / Desconto</th>
                  <th className="px-4 py-3 text-right">DY Est. (%)</th>
                  <th className="px-4 py-3 text-center">Recomendação Tática</th>
                  <th className="px-4 py-3 text-center">Research</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {ativosFiltrados.map((item) => {
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
                            item.tipo === 'Ação'
                              ? 'bg-[#10B981]/10 text-[#10B981]'
                              : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                          }`}
                        >
                          {item.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#F1F5F9]">
                        R$ {item.precoAtual.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#8B949E]">
                        R$ {item.precoTeto.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          item.desconto >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {item.desconto >= 0 ? `+${item.desconto.toFixed(1)}%` : `${item.desconto.toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-3 text-right text-[#10B981] font-bold">
                        {item.dy.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                            dentroDoTeto
                              ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                              : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                          }`}
                        >
                          {dentroDoTeto ? 'COMPRAR (Abaixo do Teto)' : 'AGUARDAR (Acima do Teto)'}
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
