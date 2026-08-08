'use client';

import { useMemo } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioRendaFixa } from '../../src/data/portfolio';

export default function RendaFixaPage() {
  const totalRendaFixa = useMemo(() => {
    return portfolioRendaFixa.reduce((acc, item) => acc + item.valorAtual, 0);
  }, []);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">RENDA FIXA & CAIXA</h1>
            <p className="text-xs text-[#8B949E]">Tesouro Direto, CDBs, Fundo DI e Caixinhas</p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>TOTAL RENDA FIXA: </span>
            <span className="text-[#10B981] font-bold text-sm block">
              R$ {totalRendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
              <tr>
                <th className="px-4 py-3">Ativo / Aplicação</th>
                <th className="px-4 py-3">Instituição</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-right">Valor Atual</th>
                <th className="px-4 py-3 text-center">Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2F3D] font-mono">
              {portfolioRendaFixa.map((item, index) => (
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
