import React, { useState } from 'react';
import { UserSettings, DEFAULT_SETTINGS, Category } from '../types';
import { X, Clock, Mail, Check, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleCategoryToggle = (cat: Category) => {
    const current = localSettings.subscribedCategories;
    let updated: Category[];
    if (current.includes(cat)) {
      updated = current.filter(c => c !== cat);
    } else {
      updated = [...current, cat];
    }
    setLocalSettings({ ...localSettings, subscribedCategories: updated });
  };

  const handleSave = () => {
    onSave(localSettings);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-g1 p-4 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={20} /> Configurar Resumo Diário
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Email Time */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Horário do envio do email</label>
            <div className="flex items-center gap-3">
              <input 
                type="time" 
                value={localSettings.emailTime}
                onChange={(e) => setLocalSettings({...localSettings, emailTime: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-lg font-mono focus:ring-2 focus:ring-g1 outline-none w-32"
              />
              <span className="text-xs text-gray-500">Horário de Brasília</span>
            </div>
          </div>

          {/* Email Address */}
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Seu Email</label>
             <div className="relative">
               <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                  type="email" 
                  placeholder="seu@email.com"
                  value={localSettings.email}
                  onChange={(e) => setLocalSettings({...localSettings, email: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-g1 outline-none"
               />
             </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Categorias no Resumo</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Category).filter(c => c !== Category.HOME).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`text-sm px-3 py-2 rounded-lg border text-left transition-all flex items-center justify-between ${
                    localSettings.subscribedCategories.includes(cat)
                      ? 'bg-green-50 border-g1 text-g1 font-bold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                  {localSettings.subscribedCategories.includes(cat) && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
              isSaved ? 'bg-green-600' : 'bg-g1 hover:bg-g1-dark'
            }`}
          >
            {isSaved ? (
              <>
                <Check size={20} /> Agendado com Sucesso!
              </>
            ) : (
              <>
                <Save size={20} /> Salvar Preferências
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400">
            *Simulação: Em um app real, o servidor processaria o envio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
