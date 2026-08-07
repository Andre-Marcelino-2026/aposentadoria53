'use client';

import { useMemo } from 'react';
import { Sidebar } from '../src/components/layout/Sidebar';
import {
  portfolioAcoes,
  portfolioFIIs,
  portfolioRendaFixa,
  userProfile,
} from '../src/data/portfolio';

export default function DashboardHome() {
  // Cálculos consolidados a partir da base central de dados (portfolio.ts)
  const totalAcoes = useMemo(() => {
    return portfolioAcoes.reduce((acc, item) => acc + item.quantidade * item.precoAtual, 0);
  }, []);

  const totalFIIs = useMemo(() => {
    return portfolioFIIs.reduce((acc, item) => acc + item.quantidade * item.precoAtual, 0);
  }, []);

  const totalRendaFixa = useMemo(() => {
    return portfolioRendaFixa.reduce((acc, item) => acc + item.valorAtual, 0);
  }, []);

  const patrimonioTotal = useMemo(() => {
    return totalAcoes + totalFIIs + totalRendaFixa;
  }, [totalAcoes, totalFIIs, totalRendaFixa]);

  // Percentuais atuais da carteira
  const pctAcoes = patrimonioTotal > 0 ? (totalAcoes / patrimonioTotal) * 100 : 0;
  const pctFIIs = patrimonioTotal > 0 ? (totalFIIs / patrimonioTotal) * 100 : 0;
  const pctRendaFixa = patrimonioTotal > 0 ? (totalRendaFixa / patrimonioTotal) * 100 : 0;

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho do Dashboard */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">
              DASHBOARD PATRIMONIAL
            </h1>
            <p className="text-xs text-[#8B949E]">
              Visão consolidada da carteira real B3 - Projeto Aposentadoria 53
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-[#8B949E] block">PATRIMÔNIO TOTAL</span>
            <span className="text-xl font-bold text-[#10B981]">
              R$ {patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Cards Resumo das Classes de Ativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {/* Card Ações */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-4 shadow">
            <div className="flex justify-between items-center text-xs text-[#8B949E] mb-1 font-sans">
              <span>AÇÕES</span>
              <span className="text-[#10B981] font-bold">{pctAcoes.toFixed(1)}%</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9]">
              R$ {totalAcoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[#8B949E] mt-2 font-sans">
              Meta Alvo: {userProfile.targetAllocations.acoes}%
            </div>
          </div>

          {/* Card FIIs */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-4 shadow">
            <div className="flex justify-between items-center text-xs text-[#8B949E] mb-1 font-sans">
              <span>FUNDS IMOBILIÁRIOS (FIIs)</span>
              <span className="text-[#3B82F6] font-bold">{pctFIIs.toFixed(1)}%</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9]">
              R$ {totalFIIs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[#8B949E] mt-2 font-sans">
              Meta Alvo: {userProfile.targetAllocations.fiis}%
            </div>
          </div>

          {/* Card Renda Fixa */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-4 shadow">
            <div className="flex justify-between items-center text-xs text-[#8B949E] mb-1 font-sans">
              <span>RENDA FIXA / TESOURO</span>
              <span className="text-[#F59E0B] font-bold">{pctRendaFixa.toFixed(1)}%</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9]">
              R$ {totalRendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[#8B949E] mt-2 font-sans">
              Meta Alvo: {userProfile.targetAllocations.rendaFixa}%
            </div>
          </div>
        </div>

        {/* Comparativo de Alocação Atual vs Meta */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow space-y-4">
          <h2 className="text-sm font-bold text-[#F1F5F9] border-b border-[#2A2F3D] pb-2 font-sans">
            DISTRIBUIÇÃO PATRIMONIAL vs META TÁTICA
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {/* Barra Ações */}
            <div>
              <div className="flex justify-between mb-1 font-sans">
                <span>Ações ({pctAcoes.toFixed(1)}% atual)</span>
                <span className="text-[#8B949E]">Alvo: {userProfile.targetAllocations.acoes}%</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-2.5 rounded overflow-hidden">
                <div
                  className="bg-[#10B981] h-full transition-all duration-500"
                  style={{ width: `${Math.min(pctAcoes, 100)}%` }}
                />
              </div>
            </div>

            {/* Barra FIIs */}
            <div>
              <div className="flex justify-between mb-1 font-sans">
                <span>FIIs ({pctFIIs.toFixed(1)}% atual)</span>
                <span className="text-[#8B949E]">Alvo: {userProfile.targetAllocations.fiis}%</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-2.5 rounded overflow-hidden">
                <div
                  className="bg-[#3B82F6] h-full transition-all duration-500"
                  style={{ width: `${Math.min(pctFIIs, 100)}%` }}
                />
              </div>
            </div>

            {/* Barra Renda Fixa */}
            <div>
              <div className="flex justify-between mb-1 font-sans">
                <span>Renda Fixa ({pctRendaFixa.toFixed(1)}% atual)</span>
                <span className="text-[#8B949E]">Alvo: {userProfile.targetAllocations.rendaFixa}%</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-2.5 rounded overflow-hidden">
                <div
                  className="bg-[#F59E0B] h-full transition-all duration-500"
                  style={{ width: `${Math.min(pctRendaFixa, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
