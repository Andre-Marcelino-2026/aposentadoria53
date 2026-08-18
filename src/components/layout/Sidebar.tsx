'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  // Estado para controlar se o menu está aberto ou fechado no telemóvel
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard Executivo', href: '/' },
    { label: 'Ações', href: '/acoes' },
    { label: 'FIIs', href: '/fiis' },
    { label: 'ETFs & BDRs', href: '/etfs' },
    { label: 'Renda Fixa', href: '/renda-fixa' },
    { label: 'Valuation & Research', href: '/valuation' },
    { label: 'Aportes', href: '/aportes' },
    { label: 'Dividendos', href: '/dividendos' },
  ];

  return (
    <>
      {/* Botão flutuante para mobile (Hamburger) - Oculto no PC */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[60] bg-[#3B82F6] text-[#FFFFFF] p-4 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] focus:outline-none transition-transform active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Fundo escuro quando o menu está aberto no mobile - Clicar fora fecha o menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#0B0E14]/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar principal - Fixa no PC, deslizante no mobile */}
      <aside
        className={`w-64 bg-[#151922] border-r border-[#2A2F3D] flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ease-in-out fixed md:relative inset-y-0 left-0 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="p-6 border-b border-[#2A2F3D]">
            <h1 className="text-lg font-bold text-[#F1F5F9] tracking-wider">
              PROJECT<span className="text-[#3B82F6]">53</span>
            </h1>
            <p className="text-[10px] text-[#8B949E] uppercase tracking-widest mt-1">
              Visão Geral
            </p>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Fecha o menu automaticamente ao clicar numa página (no mobile)
                  className={`flex items-center px-4 py-2.5 text-xs font-semibold rounded transition-colors ${
                    isActive
                      ? 'bg-[#3B82F6] text-[#FFFFFF]'
                      : 'text-[#8B949E] hover:bg-[#1A1F2B] hover:text-[#F1F5F9]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#2A2F3D]">
          <div className="text-[10px] text-[#8B949E] font-mono">
            <span>SISTEMA: </span>
            <span className="text-[#10B981]">ONLINE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
