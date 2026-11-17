import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { askPostalAssistant } from '../services/geminiService';
import { Language } from '../types';
import { LABELS } from '../constants';

interface AssistantProps {
    language: Language;
}

export const Assistant: React.FC<AssistantProps> = ({ language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sources, setSources] = useState<any[]>([]);

    const handleAsk = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse(null);
        setSources([]);
        
        const result = await askPostalAssistant(query);
        setResponse(result.answer);
        setSources(result.sources);
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 no-print">
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                    <MessageCircle size={24} />
                    <span className="font-semibold hidden md:inline">{LABELS.schemeBotTitle[language]}</span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-xl shadow-2xl w-80 md:w-96 border border-gray-200 overflow-hidden flex flex-col max-h-[500px]">
                    <div className="bg-[#D32F2F] text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold">{LABELS.schemeBotTitle[language]}</h3>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-red-800 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-y-auto bg-gray-50 min-h-[200px]">
                        {response ? (
                            <div className="bg-white p-3 rounded-lg shadow-sm border text-sm text-gray-800">
                                <p>{response}</p>
                                {sources.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 font-semibold mb-1">Sources:</p>
                                        <ul className="list-disc pl-4 text-xs text-blue-600">
                                            {sources.map((s, i) => (
                                                <li key={i}>
                                                    <a href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {s.web?.title || 'Source Link'}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : loading ? (
                             <div className="flex justify-center items-center h-full text-gray-400">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 text-sm mt-8">
                                <p>🤖</p>
                                <p>{LABELS.schemeBotPlaceholder[language]}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-white border-t flex gap-2">
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                            placeholder="Ask query..."
                            className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <button 
                            onClick={handleAsk}
                            disabled={loading || !query.trim()}
                            className="bg-[#D32F2F] text-white p-2 rounded-lg disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};