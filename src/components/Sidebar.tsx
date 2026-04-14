import { BookOpen, Grid3X3, Cpu, Library, Moon, Sun, FileText, Shield, Target, Crosshair } from 'lucide-react';

export type Section =
  | 'introduction'
  | 'lattices'
  | 'lwe'
  | 'svp'
  | 'cvp'
  | 'mlkem-theory'
  | 'mlkem'
  | 'resources';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface NavGroup {
  label?: string;
  items: { id: Section; label: string; icon: React.ReactNode }[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      { id: 'introduction', label: 'Introducción', icon: <BookOpen size={18} /> },
    ],
  },
  {
    label: 'Fundamentos matemáticos',
    items: [
      { id: 'lattices', label: 'Retículos', icon: <Grid3X3 size={18} /> },
    ],
  },
  {
    label: 'Aplicaciones criptográficas',
    items: [
      { id: 'lwe', label: 'LWE', icon: <Shield size={18} /> },
      { id: 'svp', label: 'SVP', icon: <Target size={18} /> },
      { id: 'cvp', label: 'CVP', icon: <Crosshair size={18} /> },
    ],
  },
  {
    label: 'Esquemas',
    items: [
      { id: 'mlkem-theory', label: 'ML-KEM: Teoría', icon: <FileText size={18} /> },
      { id: 'mlkem', label: 'ML-KEM: Simulador', icon: <Cpu size={18} /> },
    ],
  },
  {
    items: [
      { id: 'resources', label: 'Recursos', icon: <Library size={18} /> },
    ],
  },
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
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">
              Criptografía<br />
              <span className="text-blue-400">Post-Cuántica</span>
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">TFG – Ingeniería Informática</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
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
