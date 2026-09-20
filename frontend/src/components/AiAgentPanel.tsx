import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  MoreVertical, 
  Plus, 
  Image as ImageIcon, 
  Mic, 
  Send, 
  Check, 
  Box, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { sendChatMessage } from '../services/api';
import type { ContainerDetail, ChatMessage } from '../types';

interface AiAgentPanelProps {
  container: ContainerDetail;
  onSelectContainer: (id: string) => void;
  onTriggerSimulation: (eventType: string) => void;
  onExportPdf: () => void;
  onCompareRoutes: () => void;
}

export const AiAgentPanel: React.FC<AiAgentPanelProps> = ({
  container,
  onSelectContainer,
  onTriggerSimulation,
  onExportPdf,
  onCompareRoutes
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'user',
      text: 'Show me all containers that are in transit also show me the container that is on route.',
      timestamp: 'Today 15:32'
    },
    {
      id: '2',
      sender: 'assistant',
      text: 'Sure! Here are all containers currently in transit, plus the container currently on route for your convenience today.',
      timestamp: 'Today 15:32',
      action_type: 'SHOW_CONTAINERS',
      embedded_data: {
        containers: [
          {
            id: 'YMLU890123',
            full_id: 'YMLU 890123 4',
            type: '40 Ft High Cube',
            status: 'Active',
            location: 'Northpoint Yard',
            substatus: 'In Transit',
            color: 'orange'
          },
          {
            id: 'TRHU559871',
            full_id: 'TRHU 559871 2',
            type: '40 Ft Standard',
            status: 'In Transit',
            location: 'Westfield Terminal',
            substatus: 'On Route',
            color: 'silver'
          }
        ]
      }
    },
    {
      id: '3',
      sender: 'user',
      text: 'Put one container onto the train for me.',
      timestamp: 'Today 15:34'
    },
    {
      id: '4',
      sender: 'assistant',
      text: `Done! Container #${container.id} has been secured onto Intermodal Freight Train #FX-704 at Northpoint Yard. Continuous telemetry monitoring is active at 22°C (AI Controlled) with 92% health rating.`,
      timestamp: 'Today 15:34',
      suggested_chips: [
        'Simulate Storm Disruption',
        'Download Executive PDF',
        'Compare Eco Routes'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const resp = await sendChatMessage(query, container.id);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: resp.response,
        timestamp: 'Just now',
        action_type: resp.action_type,
        suggested_chips: resp.suggested_chips,
        embedded_data: resp.embedded_data
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `FleetX AI operational monitor: Telemetry synchronized for container #${container.id}. Cruising corridor ETA remains ${container.predicted_eta} with ${container.eta_confidence}% confidence.`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    if (chip.includes('Storm')) {
      onTriggerSimulation('STORM');
      handleSendMessage('Simulate storm disruption on vessel');
    } else if (chip.includes('PDF') || chip.includes('Report')) {
      onExportPdf();
      handleSendMessage('Generate executive incident report');
    } else if (chip.includes('Eco') || chip.includes('Route')) {
      onCompareRoutes();
      handleSendMessage('Compare route optimization profiles');
    } else if (chip.includes('YMLU')) {
      onSelectContainer('YMLU890123');
    } else {
      handleSendMessage(chip);
    }
  };

  return (
    <div className="w-full lg:w-96 xl:w-[410px] bg-white rounded-3xl border border-[#EAEFF4] shadow-card flex flex-col h-[780px] shrink-0 overflow-hidden">
      {/* Header matching reference image */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF5C00] to-orange-300 flex items-center justify-center text-white text-[11px]">
            <Sparkles size={12} />
          </div>
          <span>AI Agent</span>
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <button 
            onClick={() => setMessages([messages[0], messages[1]])}
            title="Reset Chat History"
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* Message Feed matching reference style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-2 max-w-[92%]">
                {!isUser && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 via-[#FF5C00] to-amber-300 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Sparkles size={11} />
                  </div>
                )}

                <div 
                  className={`rounded-2xl px-4 py-2.5 ${
                    isUser 
                      ? 'bg-[#F4F6F8] text-[#0F172A] rounded-br-sm' 
                      : 'bg-white border border-gray-100 text-[#1E293B] shadow-xs rounded-bl-sm'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>

                {isUser && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                      alt="Alex Morgan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Embedded Container Carousel matching reference image */}
              {m.embedded_data?.containers && (
                <div className="w-full mt-3 pl-8 pr-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 mb-2">
                    <Sparkles size={12} className="text-[#FF5C00]" />
                    <span>AI Recent Containers</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {m.embedded_data.containers.map((c: any) => (
                      <div 
                        key={c.id}
                        onClick={() => onSelectContainer(c.id)}
                        className="bg-[#F8FAFC] border border-gray-200/70 hover:border-orange-300 rounded-2xl p-2.5 cursor-pointer transition-all hover:shadow-sm group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[10px] text-[#0F172A] group-hover:text-[#FF5C00]">
                            {c.full_id}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-[#FF5C00]'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-400 mb-2">{c.type}</p>

                        {/* Flatbed container graphic */}
                        <div className="w-full h-9 bg-white rounded-lg border border-gray-100 flex items-center justify-center mb-2 px-1">
                          <div className={`w-24 h-5 rounded-xs flex items-center justify-center text-[7px] font-bold text-white shadow-xs ${
                            c.color === 'orange' ? 'bg-[#FF5C00]' : 'bg-gray-400'
                          }`}>
                            {c.id}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[8px] text-gray-500 font-medium">
                          <span className="truncate max-w-[70px]">{c.location}</span>
                          <span className="text-[#0F172A] font-bold">{c.substatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Chips */}
              {m.suggested_chips && m.suggested_chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pl-8">
                  {m.suggested_chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-50 hover:bg-orange-100 text-[#FF5C00] border border-orange-200 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 pl-8 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-[#FF5C00] animate-ping"></div>
            <span className="text-[11px] font-medium">FleetX AI is analyzing logistics streams...</span>
          </div>
        )}
      </div>

      {/* Dynamic Action Buttons Ribbon */}
      <div className="px-4 py-2 bg-gray-50/70 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <button
          onClick={() => onTriggerSimulation('STORM')}
          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-orange-50 hover:text-[#FF5C00] hover:border-orange-300 transition-colors shrink-0"
        >
          ⚡ Storm Sim
        </button>
        <button
          onClick={onExportPdf}
          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-orange-50 hover:text-[#FF5C00] hover:border-orange-300 transition-colors shrink-0"
        >
          📄 Export PDF
        </button>
        <button
          onClick={onCompareRoutes}
          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-orange-50 hover:text-[#FF5C00] hover:border-orange-300 transition-colors shrink-0"
        >
          🧭 Eco Routes
        </button>
      </div>

      {/* Input Form matching reference gradient rim */}
      <div className="p-3 bg-white border-t border-gray-100 shrink-0">
        <div className="rounded-2xl p-0.5 bg-gradient-to-r from-orange-200 via-purple-100 to-orange-100 shadow-sm">
          <div className="bg-white rounded-[14px] p-2.5">
            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 px-1">
              <span className="flex items-center gap-1 font-bold text-gray-600">
                <Sparkles size={11} className="text-[#FF5C00]" />
                FleetX AI
              </span>
              <span className="font-semibold text-gray-400 hover:text-gray-600 cursor-pointer">
                Enterprise
              </span>
            </div>

            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full text-xs text-[#0F172A] placeholder-gray-400 focus:outline-none px-1 py-1 font-medium"
            />

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 text-gray-400">
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  title="Add Attachment"
                  className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <Plus size={14} />
                </button>
                <button 
                  type="button"
                  title="Upload Container Photo / OCR"
                  className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <ImageIcon size={14} />
                </button>
                <button 
                  type="button"
                  title="Voice Command"
                  className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <Mic size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF5C00] to-[#FF8542] text-white flex items-center justify-center shadow-md shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
