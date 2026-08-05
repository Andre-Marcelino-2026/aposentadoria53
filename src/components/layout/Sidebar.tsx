'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

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
    <aside className="w-64 bg-[#151922] border-r border-[#2A2F3D] flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-[#2A2F3D]">
          <h1 className="text-lg font-bold text-[#F1F5F9] tracking-wider">
            PROJECT<span className="text-[#3B82F6]">53</span>
          </h1>
          <p className="text-[10px] text-[#8B949E] uppercase tracking-widest mt-1">
            Visão Geral
          </p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
  );
}
