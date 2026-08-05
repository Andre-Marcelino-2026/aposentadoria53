import Link from 'next/link';

export function Sidebar() {
  const menuSections = [
    {
      title: 'VISÃO GERAL',
      items: [
        { name: 'Dashboard Executivo', path: '/' },
        { name: 'Aposentadoria 53', path: '/aposentadoria' },
        { name: 'Carteira Consolidada', path: '/carteira' },
      ],
    },
    {
      title: 'CLASSES DE ATIVOS',
      items: [
        { name: 'Ações', path: '/acoes' },
        { name: 'FIIs', path: '/fiis' },
        { name: 'ETFs & BDRs', path: '/etfs' },
        { name: 'Renda Fixa', path: '/renda-fixa' },
      ],
    },
    {
      title: 'ANÁLISE & OPERAÇÕES',
      items: [
        { name: 'Valuation & Research', path: '/valuation' },
        { name: 'Aportes', path: '/aportes' },
        { name: 'Dividendos', path: '/dividendos' },
        { name: 'Histórico', path: '/historico' },
      ],
    },
  ];

  return (
    <aside className="w-[240px] h-screen bg-[#0B0E14] border-r border-[#2A2F3D] flex flex-col shrink-0">
      <div className="h-14 flex items-center px-6 border-b border-[#2A2F3D]">
        <h1 className="text-[#F1F5F9] font-bold text-sm tracking-widest">
          PROJECT<span className="text-[#3B82F6]">53</span>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-[#8B949E] text-[10px] font-bold tracking-wider mb-2 px-2">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.path}
                    className="block px-2 py-1.5 text-sm text-[#8B949E] hover:text-[#F1F5F9] hover:bg-[#151922] rounded transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
