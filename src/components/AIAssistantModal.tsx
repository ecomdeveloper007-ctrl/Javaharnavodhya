import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Droplet,
  BookOpen,
  HeartHandshake
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    tab: string;
    query?: string;
    label: string;
  };
}

export const AIAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { alumni, welfareCases, jobs, setActiveTab, setSearchQuery } = useData();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Namaste! I am your JNV Pachpadra Alumni AI Assistant. How can I assist you today? You can ask me to find batchmates, emergency blood donors, explore job openings, or learn about our welfare projects.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate intelligent response based on application context
    setTimeout(() => {
      let reply = '';
      let suggestedAction: Message['suggestedAction'] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('blood') || lower.includes('donor') || lower.includes('emergency')) {
        const donors = alumni.filter(a => a.bloodGroup);
        reply = `We have ${donors.length} registered alumni who have listed their blood groups in the directory. You can quickly filter by blood group in the Directory tab.`;
        suggestedAction = { tab: 'alumni', query: 'Blood Donor', label: 'Open Blood Donors in Directory' };
      } else if (lower.includes('job') || lower.includes('career') || lower.includes('hiring')) {
        reply = `There are currently ${jobs.length} active job postings and multiple senior alumni offering mentorship in technology, civil services, medical, and entrepreneurship.`;
        suggestedAction = { tab: 'alumni', label: 'View Career Board' };
      } else if (lower.includes('batch') || lower.includes('2008') || lower.includes('2012') || lower.includes('year')) {
        reply = `JNV Pachpadra has passout batches starting from 1999 to 2026. You can browse all batch records and contact batch coordinators directly in the Batches tab.`;
        suggestedAction = { tab: 'alumni', label: 'Explore Batches' };
      } else if (lower.includes('welfare') || lower.includes('donate') || lower.includes('donation') || lower.includes('help')) {
        const openCases = welfareCases.filter(w => w.status === 'Active');
        reply = `Our Alumni Association operates an Emergency Medical & Student Support Fund. There are currently ${openCases.length} active welfare causes requiring support. All transactions are transparently published in our Financial Ledger.`;
        suggestedAction = { tab: 'alumni', label: 'View Welfare & Giving' };
      } else if (lower.includes('song') || lower.includes('prayer') || lower.includes('prarthana') || lower.includes('navodaya')) {
        reply = `Navodaya Vidyalaya Prarthana & Song:\n"हम नवोदय हो, हम नवोदय हो...\nप्रज्ञानं ब्रह्म की पावन ज्योति जलाते हैं...\nएक सूत्र में बंधे हुए भारत का मान बढ़ाते हैं।"\n\nJNV Pachpadra (Barmer) was established in 1993 and continues to foster unity and academic excellence.`;
      } else {
        const matchAlumni = alumni.filter(a =>
          (a.fullName && a.fullName.toLowerCase().includes(lower)) ||
          (a.profession && a.profession.toLowerCase().includes(lower)) ||
          (a.city && a.city.toLowerCase().includes(lower))
        );

        if (matchAlumni.length > 0) {
          reply = `Found ${matchAlumni.length} alumni matching "${query}": ${matchAlumni.slice(0, 3).map(a => `${a.fullName} (Batch ${a.batchYear}, ${a.city})`).join(', ')}.`;
          suggestedAction = { tab: 'alumni', query: query, label: `Search "${query}" in Directory` };
        } else {
          reply = `I searched our records for "${query}". You can explore our Alumni Directory, Batches, Business Network, or Welfare funds. Is there anything specific like a batch year or profession you are looking for?`;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction
        }
      ]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 flex flex-col h-[600px] max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 p-4 sm:p-5 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight text-white">
                Navodaya Alumni AI Assistant
              </h3>
              <p className="text-xs text-slate-400">
                Instant Directory, Welfare & Batch Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => handleSend('Find blood donors in Barmer')}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-medium whitespace-nowrap border border-slate-200 flex items-center space-x-1 shadow-2xs cursor-pointer"
          >
            <Droplet className="w-3 h-3 text-rose-500" />
            <span>Blood Donors</span>
          </button>
          <button
            onClick={() => handleSend('Tell me about welfare funds')}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-medium whitespace-nowrap border border-slate-200 flex items-center space-x-1 shadow-2xs cursor-pointer"
          >
            <HeartHandshake className="w-3 h-3 text-emerald-600" />
            <span>Welfare Aid</span>
          </button>
          <button
            onClick={() => handleSend('How to contact 2008 batch?')}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-medium whitespace-nowrap border border-slate-200 flex items-center space-x-1 shadow-2xs cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-blue-600" />
            <span>Batch 2008</span>
          </button>
          <button
            onClick={() => handleSend('Navodaya Song lyrics')}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-medium whitespace-nowrap border border-slate-200 flex items-center space-x-1 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Navodaya Song</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs space-y-2 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.suggestedAction && (
                  <button
                    onClick={() => {
                      setActiveTab(msg.suggestedAction!.tab);
                      if (msg.suggestedAction!.query) {
                        setSearchQuery(msg.suggestedAction!.query);
                      }
                      onClose();
                    }}
                    className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition shadow-xs cursor-pointer"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <span>→</span>
                  </button>
                )}

                <span
                  className={`block text-[10px] text-right ${
                    msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask about alumni, batches, blood group, jobs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

