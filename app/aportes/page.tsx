'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import {
  portfolioAcoes,
  portfolioFIIs,
  portfolioRendaFixa,
  userProfile,
} from '../../src/data/portfolio';

export default function AportesPage() {
  const [valorAporte, setValorAporte] = useState<number>(1000);

  // Totais atuais
  const totalAcoes = useMemo(() => portfolioAcoes.reduce((acc, i) => acc + i.quantidade * i.precoAtual, 0), []);
  const totalFIIs = useMemo(() => portfolioFIIs.reduce((acc, i) => acc + i.quantidade * i.precoAtual, 0), []);
  const totalRendaFixa = useMemo(() => portfolioRendaFixa.reduce((acc, i) => acc + i.valorAtual, 0), []);
  const patrimonioTotal = useMemo(() => totalAcoes + totalFIIs + totalRendaFixa, [totalAcoes, totalFIIs, totalRendaFixa]);

  // Cálculo da distribuição do aporte
  const simulacao = useMemo(() => {
    const novoPatrimonio = patrimonioTotal + valorAporte;
    const metaAcoes = (novoPatrimonio * userProfile.targetAllocations.acoes) / 100;
    const metaFIIs = (novoPatrimonio * userProfile.targetAllocations.fiis) / 100;
    const metaRF = (novoPatrimonio * userProfile.targetAllocations.rendaFixa) / 100;

    const diffAcoes = Math.max(0, metaAcoes - totalAcoes);
    const diffFIIs = Math.max(0, metaFIIs - totalFIIs);
    const diffRF = Math.max(0, metaRF - totalRendaFixa);

    const somaDiffs = diffAcoes + diffFIIs + diffRF;

    if (somaDiffs === 0) {
      return { acoes: valorAporte / 3, fiis: valorAporte / 3, rf: valorAporte / 3 };
    }

    return {
      acoes: (diffAcoes / somaDiffs) * valorAporte,
      fiis: (diffFIIs / somaDiffs) * valorAporte,
      rf: (diffRF / somaDiffs) * valorAporte,
    };
  }, [patrimonioTotal, valorAporte, totalAcoes, totalFIIs, totalRendaFixa]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">CALCULADORA DE APORTES</h1>
            <p className="text-xs text-[#8B949E]">Rebalanceamento inteligente com base na alocação-alvo</p>
          </div>
        </div>

        {/* Simulador */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 space-y-4">
          <label className="text-xs text-[#8B949E] uppercase font-bold block">Valor do Novo Aporte (R$):</label>
          <input
            type="number"
            value={valorAporte}
            onChange={(e) => setValorAporte(Number(e.target.value))}
            className="bg-[#0B0E14] border border-[#2A2F3D] text-[#10B981] font-mono font-bold text-lg rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:border-[#10B981]"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm pt-4 border-t border-[#2A2F3D]">
            <div className="bg-[#0B0E14] p-4 rounded border border-[#2A2F3D]">
              <span className="text-xs text-[#8B949E] block">APORTAR EM AÇÕES</span>
              <span className="text-lg font-bold text-[#10B981]">
                R$ {simulacao.acoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-[#0B0E14] p-4 rounded border border-[#2A2F3D]">
              <span className="text-xs text-[#8B949E] block">APORTAR EM FIIs</span>
              <span className="text-lg font-bold text-[#3B82F6]">
                R$ {simulacao.fiis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-[#0B0E14] p-4 rounded border border-[#2A2F3D]">
              <span className="text-xs text-[#8B949E] block">APORTAR EM RENDA FIXA</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                R$ {simulacao.rf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
