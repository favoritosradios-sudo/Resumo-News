import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import ArticleCard from './components/ArticleCard';
import SettingsModal from './components/SettingsModal';
import { Category, NewsArticle, UserSettings, DEFAULT_SETTINGS } from './types';
import { fetchHeadlines } from './services/geminiService';
import { Loader2, RefreshCw, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category>(Category.HOME);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('resumo_news_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const loadNews = useCallback(async (category: Category) => {
    setLoading(true);
    setArticles([]); // Clear previous to show loading state cleanly
    const news = await fetchHeadlines(category);
    setArticles(news);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNews(currentCategory);
  }, [currentCategory, loadNews]);

  const handleCategorySelect = (cat: Category) => {
    setCurrentCategory(cat);
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('resumo_news_settings', JSON.stringify(newSettings));
  };

  return (
    <Layout 
      selectedCategory={currentCategory} 
      onSelectCategory={handleCategorySelect}
      onOpenSettings={() => setIsSettingsOpen(true)}
    >
      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between border-b pb-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-black text-g1-dark flex items-center gap-2">
             <span className="bg-g1 text-white p-1 rounded">
               <FileText size={24} />
             </span>
             Resumo Diário
           </h1>
           <p className="text-gray-500 text-sm mt-1">
             Principais notícias de <strong>{currentCategory}</strong> selecionadas para você.
           </p>
        </div>
        <button 
          onClick={() => loadNews(currentCategory)}
          className="text-g1 hover:bg-green-50 p-2 rounded-full transition-colors"
          title="Atualizar Notícias"
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader2 size={40} className="text-g1 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Preparando seu resumo...</h3>
          <p className="text-sm text-gray-500 mt-2">Nossa IA está lendo e resumindo as notícias.</p>
        </div>
      )}

      {/* News List */}
      {!loading && (
        <div className="max-w-3xl mx-auto space-y-8">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
            />
          ))}
          
          {articles.length === 0 && (
             <div className="text-center py-20 text-gray-500 bg-white rounded-xl border">
                Nenhuma notícia encontrada nesta categoria.
             </div>
          )}

          <div className="text-center pt-8 pb-12 text-gray-400 text-xs">
             Fim do resumo de hoje. Volte amanhã para mais.
          </div>
        </div>
      )}
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </Layout>
  );
};

export default App;