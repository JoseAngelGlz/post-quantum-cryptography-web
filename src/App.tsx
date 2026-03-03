import { useState, useEffect } from 'react';
import Sidebar, { type Section } from './components/Sidebar';
import Introduction from './components/Introduction';
import Lattices from './components/Lattices';
import MLKEMSimulator from './components/MLKEMSimulator';
import Resources from './components/Resources';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('introduction');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Persist dark mode preference in localStorage
    return localStorage.getItem('darkMode') === 'true';
  });

  // Apply/remove the 'dark' class on <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const renderSection = () => {
    switch (activeSection) {
      case 'introduction':
        return <Introduction />;
      case 'lattices':
        return <Lattices />;
      case 'mlkem':
        return <MLKEMSimulator />;
      case 'resources':
        return <Resources />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
      />
      <main className="flex-1 p-8 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
