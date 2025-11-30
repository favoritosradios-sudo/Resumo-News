import React, { useState } from 'react';
import { Category } from '../types';
import { Menu, X, Search, User, Clock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  onOpenSettings: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  selectedCategory, 
  onSelectCategory,
  onOpenSettings
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = Object.values(Category);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <header className="bg-g1 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-g1-dark p-2 rounded-lg transition-colors md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div 
              className="text-white font-black text-3xl tracking-tighter cursor-pointer"
              onClick={() => onSelectCategory(Category.HOME)}
            >
              Resumo<span className="font-light">News</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-sm font-bold uppercase transition-colors ${
                  selectedCategory === cat ? 'text-white border-b-2 border-white' : 'text-green-200 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="text-white p-2 hover:bg-g1-dark rounded-full">
              <Search size={20} />
            </button>
            <button 
              onClick={onOpenSettings}
              className="bg-white text-g1 font-bold text-xs px-3 py-1.5 rounded uppercase flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <Clock size={14} />
              <span>Configurar Envio</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-g1-dark border-t border-green-800">
            <div className="flex flex-col p-4 space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left font-bold ${
                    selectedCategory === cat ? 'text-white pl-2 border-l-4 border-white' : 'text-green-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Sub-header for secondary nav on desktop if needed, or breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-2 hidden md:block">
         <div className="container mx-auto px-4 flex gap-4 text-xs font-medium text-gray-500 overflow-x-auto">
            {categories.slice(5).map(cat => (
               <button 
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`hover:text-g1 ${selectedCategory === cat ? 'text-g1 font-bold' : ''}`}
               >
                 {cat}
               </button>
            ))}
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-g1 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-xl mb-2">Resumo<span className="font-light">News</span></p>
          <p className="text-sm text-green-200">
            © 2024 Resumo News. Curadoria realizada por Inteligência Artificial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;