import React, { useState } from 'react';
import { NewsArticle, Category } from '../types';
import { MessageCircle, Mail, Clock, Calendar, Copy, Check } from 'lucide-react';

interface ArticleCardProps {
  article: NewsArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [copied, setCopied] = useState(false);
  
  // Ensure title ends with a dot
  const titleWithDot = article.title.trim().endsWith('.') ? article.title : `${article.title}.`;

  const handleWhatsAppShare = () => {
    const text = `*${titleWithDot}*\n\n${article.summary}\n\n_Via Resumo News_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `Notícia: ${titleWithDot}`;
    const body = `${titleWithDot}\n\n${article.summary}\n\nLeia mais no Resumo News.`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleCopy = () => {
    const textToCopy = `${titleWithDot}\n\n${article.summary}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text', err);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6 md:p-8">
        {/* Header: Category, Source & Time */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
              article.category === Category.GOSSIP 
                ? 'bg-pink-100 text-pink-700' 
                : article.category === Category.GOSPEL
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-g1'
            }`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-600 font-bold flex items-center gap-1">
              {article.sourceName || 'Redação'}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
            <Calendar size={12} className="text-gray-400" />
            {article.publishedTime}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
          {titleWithDot}
        </h2>

        {/* Full Text Content */}
        <div className="prose prose-green max-w-none">
          <p className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-sans text-justify">
            {article.summary}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium mr-2 hidden sm:inline">Compartilhar:</span>
          
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Copiar texto"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>

          <button 
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#128C7E] transition-colors shadow-sm"
            title="Compartilhar no WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
          
          <button 
            onClick={handleEmailShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
            title="Enviar por Email"
          >
            <Mail size={16} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;