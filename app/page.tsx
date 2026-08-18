'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../src/components/layout/Sidebar';
import { portfolioAcoes, portfolioFIIs, portfolioRendaFixa, userProfile, TAXA_SELIC_ANUAL } from '../src/data/portfolio';

const BRAPI_TOKEN = 'oirG1gyFEtXo7ubChNnZgK';

export default function DashboardPage() {
  const [realTimeData, setRealTimeData] = useState<Record<string, { price: number; changeAbs: number; changePct: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrapi = async () => {
      try {
        const tickersRV = [...portfolioAcoes, ...portfolioFIIs]
          .map((item) => item.ticker)
          .filter((t) => !t.endsWith('13') && !t.endsWith('12') && !t.endsWith('14'));

        if (tickersRV.length === 0) {
          setLoading(false);
          return;
        }

        const newData: Record<string, { price: number; changeAbs: number; changePct: number }> = {};

        // A SOLUÇÃO: Requisições individuais simultâneas para driblar a restrição do plano gratuito da Brapi
        await Promise.all(
          tickersRV.map(async (ticker) => {
            try {
              const res = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${BRAPI_TOKEN}`);
              const data = await res.json();
              if (data && data.results && data.results.length > 0) {
                const item = data.results[0];
                newData[ticker] = {
                  price: item.regularMarketPrice || 0,
                  changeAbs: item.regularMarketChange || 0,
                  changePct: item.regularMarketChangePercent || 0,
                };
              }
            } catch (err) {
              // Se um ticker falhar, falha em silêncio e não afeta os outros
            }
          })
        );
        
        setRealTimeData(newData);
      } catch (error) {
        console.error('Erro geral ao conectar com Brapi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrapi();
  }, []);

  // 1. Processamento da Renda Variável (API Brapi)
  const totalAcoes = portfolioAcoes.reduce((acc, item) => acc + (item.quantidade * (realTimeData[item.ticker]?.price || item.precoAtual)), 0);
  const totalFIIs = portfolioFIIs.reduce((acc, item) => acc + (item.quantidade * (realTimeData[item.ticker]?.price || item.precoAtual)), 0);
  
  const varAcoesAbs = portfolioAcoes.reduce((acc, item) => acc + (item.quantidade * (realTimeData[item.ticker]?.changeAbs || 0)), 0);
  const varFIIsAbs = portfolioFIIs.reduce((acc, item) => acc + (item.quantidade * (realTimeData[item.ticker]?.changeAbs || 0)), 0);

  // 2. Processamento da Renda Fixa (Simulação Selic)
  const taxaDiariaSelic = Math.pow(1 + TAXA_SELIC_ANUAL / 100, 1 / 252) - 1;
  const totalRF = portfolioRendaFixa.reduce((acc, item) => acc + item.valorAtual, 0);
  const varRFAbs = totalRF * taxaDiariaSelic;

  // 3. Totais Consolidados do Patrimônio
  const patrimonioTotal = totalAcoes + totalFIIs + totalRF;
  const variacaoTotalAbs = varAcoesAbs + varFIIsAbs + varRFAbs;
  const variacaoTotalPct = patrimonioTotal > 0 ? (variacaoTotalAbs / (patrimonioTotal - variacaoTotalAbs)) * 100 : 0;

  // 4. Metas e Projeções (Corrigido para 2 casas decimais)
  const rendaPassivaProjetada = patrimonioTotal * 0.008; 
  const progressoMeta = Math.min((rendaPassivaProjetada / userProfile.targetMonthlyPassiveIncome) * 100, 100);

  // 5. Preparar Tabela Consolidada (Top 10 ativos por valor)
  const listaConsolidada = useMemo(() => {
    const rv = [...portfolioAcoes, ...portfolioFIIs].map(item => ({
      ticker: item.ticker,
      nome: item.nome,
      classe: portfolioAcoes.includes(item as any) ? 'AÇÕES/ETF' : 'FII',
      qtd: item.quantidade,
      cotacao: realTimeData[item.ticker]?.price || item.precoAtual,
      varPct: realTimeData[item.ticker]?.changePct || 0,
      varAbs: realTimeData[item.ticker]?.changeAbs || 0,
      total: item.quantidade * (realTimeData[item.ticker]?.price || item.precoAtual)
    }));

    const rf = portfolioRendaFixa.map(item => ({
      ticker: item.nome,
      nome: item.instituicao,
      classe: 'RENDA FIXA',
      qtd: item.quantidade,
      cotacao: item.valorAtual / (item.quantidade || 1),
      varPct: taxaDiariaSelic * 100,
      varAbs: item.valorAtual * taxaDiariaSelic,
      total: item.valorAtual
    }));

    return [...rv, ...rf].sort((a, b) => b.total - a.total).slice(0, 10);
  }, [realTimeData, taxaDiariaSelic]);

  const isAlta = variacaoTotalAbs >= 0;

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">DASHBOARD EXECUTIVO</h1>
            <p className="text-sm text-[#8B949E]">Projeto Aposentadoria 53 • Visão Consolidada</p>
          </div>
          <div className="text-right text-xs text-[#10B981] font-mono border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 rounded">
            {loading ? 'Sincronizando B3...' : 'STATUS: ONLINE'}
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Patrimônio e Rendimento */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-6 shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] text-[#8B949E] uppercase tracking-wider mb-1">Rendimento Consolidado (Hoje)</p>
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl font-bold font-mono ${isAlta ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    R$ {isAlta ? '+' : ''}{variacaoTotalAbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${isAlta ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {isAlta ? '▲' : '▼'} {variacaoTotalPct.toFixed(2)}%
                  </span>
                </div>
                <p className="text-[10px] text-[#8B949E] mt-2">*Inclui simulação RF (Selic {TAXA_SELIC_ANUAL}% a.a.)</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#8B949E] uppercase tracking-wider mb-1">Patrimônio Total</p>
                <span className="text-2xl font-bold font-mono text-[#F1F5F9]">
                  R$ {patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Card Meta */}
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[11px] text-[#8B949E] uppercase tracking-wider font-bold">Meta Aposentadoria 53 Anos</p>
            </div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">Renda Passiva Projetada (0,8% a.m.)</p>
                <span className="text-xl font-bold font-mono text-[#3B82F6]">
                  R$ {rendaPassivaProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">Meta Mensal</p>
                <span className="text-xl font-bold font-mono text-[#F1F5F9]">
                  R$ {userProfile.targetMonthlyPassiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {/* Barra de Progresso */}
            <div className="w-full bg-[#0B0E14] rounded-full h-2.5 mt-2 overflow-hidden border border-[#2A2F3D]">
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressoMeta}%` }}></div>
            </div>
            <p className="text-right text-[10px] font-bold text-[#10B981] mt-2">{progressoMeta.toFixed(1)}% CONCLUÍDO</p>
          </div>
        </div>

        {/* Tabela Resumo (Top 10) */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2A2F3D] bg-[#0B0E14] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#F1F5F9]">MAIORES POSIÇÕES DA CARTEIRA</h2>
          </div>
          <div className="overflow-x-auto p-5">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D]">
                <tr>
                  <th className="px-4 py-3">Ativo</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3 text-right">Cotação / Ref</th>
                  <th className="px-4 py-3 text-right">Var (Dia)</th>
                  <th className="px-4 py-3 text-right">Valor Total (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {listaConsolidada.map((item, idx) => {
                  const alta = item.varPct >= 0;
                  return (
                    <tr key={idx} className="hover:bg-[#1A1F2B] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#F1F5F9]">{item.ticker}</div>
                        <div className="text-[10px] text-[#8B949E] font-sans truncate max-w-[120px]">{item.nome}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-sans text-[#3B82F6]">{item.classe}</td>
                      <td className="px-4 py-3 text-right text-[#F1F5F9]">R$ {item.cotacao.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-bold ${alta ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {alta ? '▲' : '▼'} {Math.abs(item.varPct).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#F1F5F9]">
                        R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
