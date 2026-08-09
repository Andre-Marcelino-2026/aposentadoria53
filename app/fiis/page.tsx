'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioFIIs } from '../../src/data/portfolio';

const BRAPI_TOKEN = 'oirG1gyFEtXo7ubChNnZgK';

export default function FIIsPage() {
  const [realTimeData, setRealTimeData] = useState<Record<string, { price: number; change: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrapi = async () => {
      try {
        const tickers = portfolioFIIs.map((f) => f.ticker).join(',');
        const res = await fetch(`https://brapi.dev/api/quote/${tickers}?token=${BRAPI_TOKEN}`);
        const data = await res.json();
        
        const newData: Record<string, { price: number; change: number }> = {};
        if (data.results) {
          data.results.forEach((item: any) => {
            newData[item.symbol] = {
              price: item.regularMarketPrice,
              change: item.regularMarketChangePercent || 0,
            };
          });
        }
        setRealTimeData(newData);
      } catch (error) {
        console.error('Erro ao conectar com Brapi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrapi();
  }, []);

  // Une dados fixos + cotação ao vivo e ORDENA DO MAIOR PARA O MENOR VALOR TOTAL
  const fiisOrdenados = useMemo(() => {
    return portfolioFIIs
      .map((fundo) => {
        const precoAoVivo = realTimeData[fundo.ticker]?.price || fundo.precoAtual;
        const variacao = realTimeData[fundo.ticker]?.change || 0;
        const valorTotal = fundo.quantidade * precoAoVivo;
        return { ...fundo, precoAoVivo, variacao, valorTotal };
      })
      .sort((a, b) => b.valorTotal - a.valorTotal); // ORDENAÇÃO: Maior -> Menor
  }, [realTimeData]);

  const totalInvestido = useMemo(() => {
    return fiisOrdenados.reduce((acc, item) => acc + item.valorTotal, 0);
  }, [fiisOrdenados]);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">FUNDOS IMOBILIÁRIOS (FIIs)</h1>
            <p className="text-xs text-[#8B949E]">
              {loading ? 'Sincronizando com a Bolsa (B3)...' : 'Ordenado do Maior para o Menor Valor 🟢'}
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>TOTAL EXIBIDO: </span>
            <span className="text-[#10B981] font-bold text-sm block">
              R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Tabela Principal Ordenada */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
              <tr>
                <th className="px-4 py-3">Ticker</th>
                <th className="px-4 py-3 text-right">Qtd</th>
                <th className="px-4 py-3 text-right">Preço (Live)</th>
                <th className="px-4 py-3 text-right">Var. Dia</th>
                <th className="px-4 py-3 text-right">Preço Teto</th>
                <th className="px-4 py-3 text-right">Total Atual (▼)</th>
                <th className="px-4 py-3 text-center">Segmento</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2F3D] font-mono">
              {fiisOrdenados.map((item) => {
                const dentroDoTeto = item.precoAoVivo <= item.precoTeto;
                const isAlta = item.variacao > 0;
                const isQueda = item.variacao < 0;

                return (
                  <tr key={item.ticker} className="hover:bg-[#1A1F2B] transition-colors">
                    <td className="px-4 py-3 font-bold text-[#F1F5F9]">{item.ticker}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.quantidade}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">R$ {item.precoAoVivo.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${isAlta ? 'text-[#10B981]' : isQueda ? 'text-[#EF4444]' : 'text-[#8B949E]'}`}>
                      {isAlta ? '▲ ' : isQueda ? '▼ ' : ''}{item.variacao.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-[#8B949E]">R$ {item.precoTeto.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#10B981]">
                      R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-sans text-[#8B949E]">{item.segmento}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                          dentroDoTeto ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}
                      >
                        {dentroDoTeto ? 'Abaixo Teto' : 'Acima Teto'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
