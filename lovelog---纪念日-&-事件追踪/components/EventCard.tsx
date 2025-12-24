import React, { useState, useRef, useCallback } from 'react';
import { MemoryEvent } from '../types';
import { calculateDateDetails, formatDateDisplay } from '../utils/dateUtils';
import { Calendar, Trash2, Sparkles, RefreshCw, Edit2, Download, Loader2 } from 'lucide-react';
import { generateEventMessage } from '../services/geminiService';
import { THEMES } from '../utils/theme';
import { toPng } from 'html-to-image';

interface EventCardProps {
  event: MemoryEvent;
  onDelete: (id: string) => void;
  onEdit: (event: MemoryEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete, onEdit }) => {
  const { daysSince, daysUntilNext, isFuture } = calculateDateDetails(event.date, event.isRecurring);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Default to rose if theme is missing (backward compatibility)
  const theme = THEMES[event.theme || 'rose'];

  const handleAiGenerate = async () => {
    setLoadingAi(true);
    const msg = await generateEventMessage(event.title, isFuture ? daysUntilNext : daysSince, isFuture);
    setAiMessage(msg);
    setLoadingAi(false);
  };

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        // Filter out the action buttons so they don't appear in the image
        filter: (node) => {
           return !node.classList?.contains('card-actions');
        },
        pixelRatio: 2 // Higher quality
      });
      
      const link = document.createElement('a');
      link.download = `${event.title}-${formatDateDisplay(event.date)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert('保存图片失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  }, [event.title, event.date, isDownloading]);

  return (
    <div 
      ref={cardRef}
      className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-white mb-6 group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 bg-gray-200">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} opacity-90`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-6 text-white h-full flex flex-col justify-end min-h-[320px]">
        
        {/* Header Actions - Added class 'card-actions' for filtering during screenshot */}
        <div className="card-actions absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
             <button 
              onClick={handleDownload}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
              title="保存为图片"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Download size={18} className="text-white" />
              )}
            </button>
             <button 
              onClick={() => onEdit(event)}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
              title="编辑"
            >
              <Edit2 size={18} className="text-white" />
            </button>
            <button 
              onClick={() => onDelete(event.id)}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-red-500/80 transition-colors"
              title="删除"
            >
              <Trash2 size={18} className="text-white" />
            </button>
        </div>

        <div className="mt-auto">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider flex items-center">
               {event.isRecurring ? <RefreshCw size={12} className="mr-1" /> : <Calendar size={12} className="mr-1" />}
               {isFuture ? '即将到来' : formatDateDisplay(event.date)}
            </span>
          </div>

          <h3 className="text-3xl font-bold serif mb-4 leading-tight shadow-sm">
            {event.title}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Primary Stat */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/70 uppercase tracking-widest mb-1">
                {isFuture ? '倒计时' : '已度过'}
              </div>
              <div className="text-2xl font-bold">
                {isFuture ? daysUntilNext : daysSince}
                <span className="text-sm font-normal ml-1">天</span>
              </div>
            </div>

            {/* Secondary Stat (Only for recurring past events or years count) */}
            {(event.isRecurring && !isFuture) && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                 <div className="text-xs text-white/70 uppercase tracking-widest mb-1">
                  下个纪念日
                </div>
                <div className="text-2xl font-bold">
                  {daysUntilNext}
                  <span className="text-sm font-normal ml-1">天</span>
                </div>
              </div>
            )}
             
            {(!event.isRecurring && !isFuture) && (
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-center">
                  <span className="text-white/80 italic text-sm">珍贵的回忆</span>
               </div>
            )}
          </div>

          {/* AI Message Section */}
          <div className="min-h-[60px]">
            {aiMessage ? (
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/10 animate-fade-in">
                <p className="text-sm italic font-serif leading-relaxed">"{aiMessage}"</p>
              </div>
            ) : (
              <button 
                onClick={handleAiGenerate}
                disabled={loadingAi}
                className="flex items-center space-x-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <Sparkles size={16} className={loadingAi ? 'animate-spin' : ''} />
                <span>{loadingAi ? 'AI 丘比特正在思考...' : '生成 AI 寄语'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventCard;