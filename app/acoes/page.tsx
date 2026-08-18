'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { portfolioAcoes } from '../../src/data/portfolio';

const BRAPI_TOKEN = 'oirG1gyFEtXo7ubChNnZgK';

type SortField = 'ticker' | 'quantidade' | 'precoAoVivo' | 'variacao' | 'precoTeto' | 'valorTotal';
type SortOrder = 'asc' | 'desc';

export default function AcoesPage() {
  const [realTimeData, setRealTimeData] = useState<Record<string, { price: number; change: number; changeAbs: number }>>({});
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState<SortField>('valorTotal');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const fetchBrapi = async () => {
      try {
        const tickersValidos = portfolioAcoes
          .map((a) => a.ticker)
          .filter((t) => !t.endsWith('13') && !t.endsWith('12') && !t.endsWith('14'));

        if (tickersValidos.length === 0) {
          setLoading(false);
          return;
        }

        const newData: Record<string, { price: number; change: number; changeAbs: number }> = {};
        
        // Correção: Múltiplas chamadas para o plano gratuito Brapi
        await Promise.all(
          tickersValidos.map(async (ticker) => {
            try {
              const res = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${BRAPI_TOKEN}`);
              const data = await res.json();
              if (data && data.results && data.results.length > 0) {
                const item = data.results[0];
                newData[ticker] = {
                  price: item.regularMarketPrice || 0,
                  change: item.regularMarketChangePercent || 0,
                  changeAbs: item.regularMarketChange || 0,
                };
              }
            } catch (err) {}
          })
        );
        
        setRealTimeData(newData);
      } catch (error) {
        console.error('Erro ao conectar com Brapi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrapi();
  }, []);

  const acoesProcessadas = useMemo(() => {
    const lista = portfolioAcoes.map((acao) => {
      const precoAoVivo = realTimeData[acao.ticker]?.price || acao.precoAtual;
      const variacao = realTimeData[acao.ticker]?.change || 0;
      const variacaoAbs = realTimeData[acao.ticker]?.changeAbs || 0;
      const valorTotal = acao.quantidade * precoAoVivo;
      return { ...acao, precoAoVivo, variacao, variacaoAbs, valorTotal };
    });

    return lista.sort((a, b) => {
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
  }, [realTimeData, sortField, sortOrder]);

  const totalInvestido = useMemo(() => {
    return acoesProcessadas.reduce((acc, item) => acc + item.valorTotal, 0);
  }, [acoesProcessadas]);

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
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">CARTEIRA DE AÇÕES & ETFs</h1>
            <p className="text-xs text-[#8B949E]">
              {loading ? 'Sincronizando com a Bolsa (B3)...' : 'Clique no cabeçalho de qualquer coluna para ordenar ⇅'}
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>TOTAL EM CARTEIRA: </span>
            <span className="text-[#10B981] font-bold text-sm block">
              R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
              <tr>
                <th className="px-4 py-3 cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('ticker')}>
                  Ticker / Produto {renderSortIcon('ticker')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('quantidade')}>
                  Qtd {renderSortIcon('quantidade')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('precoAoVivo')}>
                  Preço (Live) {renderSortIcon('precoAoVivo')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('variacao')}>
                  Var. Dia (R$ / %) {renderSortIcon('variacao')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('precoTeto')}>
                  Preço Teto {renderSortIcon('precoTeto')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer select-none hover:text-[#F1F5F9]" onClick={() => handleSort('valorTotal')}>
                  Valor Atualizado (R$) {renderSortIcon('valorTotal')}
                </th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2F3D] font-mono">
              {acoesProcessadas.map((item) => {
                const dentroDoTeto = item.precoAoVivo <= item.precoTeto;
                const isAlta = item.variacao > 0;
                const isQueda = item.variacao < 0;

                return (
                  <tr key={item.ticker} className="hover:bg-[#1A1F2B] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#F1F5F9]">{item.ticker}</div>
                      <div className="text-[10px] text-[#8B949E] font-sans truncate max-w-[120px]">{item.nome}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">{item.quantidade}</td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">R$ {item.precoAoVivo.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${isAlta ? 'text-[#10B981]' : isQueda ? 'text-[#EF4444]' : 'text-[#8B949E]'}`}>
                      {isAlta ? '▲ ' : isQueda ? '▼ ' : ''} R$ {Math.abs(item.variacaoAbs).toFixed(2)} ({item.variacao.toFixed(2)}%)
                    </td>
                    <td className="px-4 py-3 text-right text-[#8B949E]">R$ {item.precoTeto.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#F1F5F9]">
                      R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
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
