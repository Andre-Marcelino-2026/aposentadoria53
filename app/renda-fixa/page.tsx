'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { initialAssets } from '../../src/data/initialState';
import { updateAssetsWithPrices } from '../../src/api/stockApi';

export default function RendaFixaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPrices() {
      setLoading(true);
      const updated = await updateAssetsWithPrices(initialAssets);
      // FILTRO: Pega apenas os ativos da classe RENDA FIXA
      const onlyRendaFixa = updated.filter(
        (item) =>
          item.asset?.assetClass === 'RENDA FIXA' ||
          item.asset?.assetClass === 'RENDIMENTO FIXA'
      );
      setAssets(onlyRendaFixa);
      setLoading(false);
    }

    loadPrices();
  }, []);

  // Cálculos específicos para o resumo
  const totalInvested = assets.reduce(
    (acc, item) => acc + (item.currentValue || 0),
    0
  );

  return (
    <div className="flex h-screen bg-[#0B0E14] text-[#F1F5F9] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-[#2A2F3D] pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10B981]">
              CARTEIRA DE RENDA FIXA
            </h1>
            <p className="text-xs text-[#8B949E]">
              Segurança, liquidez e crescimento previsível
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#8B949E]">
            <span>STATUS: </span>
            <span className="text-[#10B981] font-bold">
              {loading ? 'ATUALIZANDO...' : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Patrimônio em Renda Fixa
            </p>
            <p className="text-[#10B981] text-2xl font-bold font-mono">
              R${' '}
              {totalInvested.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
            <p className="text-[#8B949E] text-xs mb-1 uppercase tracking-wider">
              Perfil de Risco
            </p>
            <p className="text-[#10B981] text-2xl font-bold font-mono">
              CONSERVADOR
            </p>
          </div>
        </div>

        {/* Tabela Exclusiva */}
        <div className="bg-[#151922] border border-[#2A2F3D] rounded p-5 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-[#8B949E] uppercase tracking-wider border-b border-[#2A2F3D] bg-[#0B0E14]">
                <tr>
                  <th className="px-4 py-3 rounded-tl">Título / Ticker</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                  <th className="px-4 py-3 text-right">Valor Unitário</th>
                  <th className="px-4 py-3 text-right rounded-tr">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F3D] font-mono">
                {assets.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#1A1F2B] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-[#F1F5F9]">
                      {item.asset?.ticker}
                    </td>
                    <td className="px-4 py-3 text-[#8B949E] font-sans text-xs">
                      {item.asset?.name}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">
                      {item.currentQuantity}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9]">
                      {item.currentPrice
                        ? `R$ ${item.currentPrice.toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-[#F1F5F9] font-bold">
                      {item.currentValue
                        ? `R$ ${item.currentValue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
