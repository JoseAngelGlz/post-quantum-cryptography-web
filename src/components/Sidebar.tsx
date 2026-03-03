import { BookOpen, Grid3X3, Cpu, Library, Moon, Sun } from 'lucide-react';

export type Section = 'introduction' | 'lattices' | 'mlkem' | 'resources';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'introduction', label: 'Introducción', icon: <BookOpen size={18} /> },
  { id: 'lattices', label: 'Lattices (Retículos)', icon: <Grid3X3 size={18} /> },
  { id: 'mlkem', label: 'Simulador ML-KEM', icon: <Cpu size={18} /> },
  { id: 'resources', label: 'Recursos', icon: <Library size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-800 dark:bg-slate-900 text-white shadow-xl">
      {/* Logo / Title */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold leading-tight text-white">
          Criptografía<br />
          <span className="text-blue-400">Post-Cuántica</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">TFG – Ingeniería Informática</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === item.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
