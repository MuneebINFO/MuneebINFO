'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tag, ArrowLeftRight, Sparkles } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';

const links = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/categories', label: 'Catégories', icon: Tag },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/insights', label: 'IA Épargne', icon: Sparkles },
];

export default function Navigation() {
  const pathname = usePathname();
  const { alerts } = useBudget();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#FF6200] flex items-center justify-center text-white font-bold text-lg">I</div>
          <span className="font-bold text-gray-900 text-lg">ING Budget</span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active ? 'bg-[#FF6200] text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF6200]'}`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
                {href === '/insights' && alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
