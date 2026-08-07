'use client';

import { useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioAcoes, portfolioFIIs, userProfile } from '../../src/data/portfolio';

export default function DividendosPage() {
  // Renda média mensal estimada das Ações e FIIs reais
  const rendaMensalEstimada = useMemo(() => {
    const rendaAcoes = portfolioAcoes.reduce((acc, a) => {
      const valorTotal = a.quantidade * a.precoAtual;
      return acc + (valorTotal * (a.dy / 100)) / 12;
    }, 0);

    const rendaFIIs = portfolioFIIs.reduce((acc, f) => {
      const valorTotal = f.quantidade * f.precoAtual;
      return acc + valorTotal * (f.dyMensal / 100);
    }, 0);

    return rendaAcoes + rendaFIIs;
  }, []);

  const progressoMeta = useMemo(() => {
    return Math.min((rendaMensalEstimada / userProfile.targetMonthlyPassiveIncome) * 100, 100);
  }, [rendaMensalEstimada]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">RENDA PASSIVA & DIVIDENDOS</h1>
            <p className="text-xs text-[#8B949E]">Acompanhamento do progresso de independência financeira</p>
          </div>
        </div>

        {/* Cards da Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5">
            <span className="text-xs text-[#8B949E] block mb-1">RENDA MENSAL ESTIMADA (ATUAL)</span>
            <span className="text-2xl font-bold text-[#10B981]">
              R$ {rendaMensalEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
            </span>
          </div>

          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5">
            <span className="text-xs text-[#8B949E] block mb-1">META DE RENDA PASSIVA</span>
            <span className="text-2xl font-bold text-[#F1F5F9]">
              R$ {userProfile.targetMonthlyPassiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
            </span>
          </div>
        </div>

        {/* Barra de Progresso da Meta */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 space-y-3">
          <div className="flex justify-between text-xs font-mono">
            <span>PROGRESSO DA META</span>
            <span className="text-[#10B981] font-bold">{progressoMeta.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#0B0E14] h-4 rounded-full overflow-hidden border border-[#2A2F3D]">
            <div
              className="bg-[#10B981] h-full transition-all duration-500"
              style={{ width: `${progressoMeta}%` }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
