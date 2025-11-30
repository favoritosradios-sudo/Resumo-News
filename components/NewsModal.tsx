import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../types';
import { generateArticleSummary } from '../services/geminiService';
import { X, Share2, Mail, Loader2, Send } from 'lucide-react';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article) {
      if (article.summary) {
        setSummary(article.summary);
      } else {
        setLoading(true);
        generateArticleSummary(article).then(text => {
          setSummary(text);
          setLoading(false);
          // Ideally update the article in the parent state here to cache it
          article.summary = text;
        });
      }
    } else {
      setSummary(null);
    }
  }, [article]);

  if (!article) return null;

  const handleWhatsAppShare = () => {
    if (!summary) return;
    const text = `*${article.title}*\n\n${summary}\n\n_Via Resumo News_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    if (!summary) return;
    const subject = `Notícia: ${article.title}`;
    const body = `${article.title}\n\n${summary}\n\nLeia mais no Resumo News.`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-64 shrink-0">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
             <span className="text-white text-xs font-bold uppercase bg-g1 px-2 py-1 rounded mb-2 inline-block">
               {article.category}
             </span>
             <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">
               {article.title}
             </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1">
          <div className="mb-6">
            <h3 className="text-gray-500 font-medium text-lg mb-4 italic">
              {article.subtitle}
            </h3>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
               <h4 className="text-g1 font-bold text-sm uppercase mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 bg-g1 rounded-full animate-pulse"></span>
                 Resumo Inteligente
               </h4>
               
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-8 text-g1">
                   <Loader2 size={32} className="animate-spin mb-2" />
                   <p className="text-sm">Nosso editor IA está escrevendo o resumo...</p>
                 </div>
               ) : (
                 <p className="text-gray-800 text-lg leading-relaxed font-serif whitespace-pre-wrap">
                   {summary}
                 </p>
               )}
            </div>
          </div>

          <div className="text-right text-xs text-gray-400 mb-6">
            {summary ? `${summary.length} caracteres` : ''}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 border-t pt-6">
            <button 
              onClick={handleWhatsAppShare}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={20} />
              WhatsApp
            </button>
            <button 
              onClick={handleEmailShare}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <Mail size={20} />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;