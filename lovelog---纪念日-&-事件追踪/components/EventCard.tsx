import React, { useRef, useCallback, useState } from 'react';
import { MemoryEvent } from '../types';
import { calculateDateDetails, formatDateDisplay } from '../utils/dateUtils';
import { Calendar, Trash2, RefreshCw, Edit2, Download, Loader2 } from 'lucide-react';
import { THEMES } from '../utils/theme';
import { toPng } from 'html-to-image';

interface EventCardProps {
  event: MemoryEvent;
  onDelete: (id: string) => void;
  onEdit: (event: MemoryEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete, onEdit }) => {
  const { daysSince, daysUntilNext, isFuture } = calculateDateDetails(event.date, event.isRecurring);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Default to rose if theme is missing (backward compatibility)
  const theme = THEMES[event.theme || 'rose'];

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure any UI states are settled
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        // Filter out the action buttons so they don't appear in the image
        filter: (node) => {
           return !node.classList?.contains('card-actions');
        },
        pixelRatio: 2, // Retain high quality
        backgroundColor: '#ffffff', // Prevent transparent backgrounds turning black
        skipFonts: true, // 关键修复：跳过加载跨域字体文件，防止 "Cannot access rules" 报错
      });
      
      const link = document.createElement('a');
      link.download = `LoveLog-${event.title}-${formatDateDisplay(event.date)}.png`;
      link.href = dataUrl;
      // Append to body is required for some mobile browsers to trigger download correctly
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-6 text-white h-full flex flex-col justify-end min-h-[280px]">
        
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

          <h3 className="text-3xl font-bold serif mb-6 leading-tight shadow-sm">
            {event.title}
          </h3>

          <div className="grid grid-cols-2 gap-4">
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
            {(event.isRecurring && !isFuture) ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                 <div className="text-xs text-white/70 uppercase tracking-widest mb-1">
                  下个纪念日
                </div>
                <div className="text-2xl font-bold">
                  {daysUntilNext}
                  <span className="text-sm font-normal ml-1">天</span>
                </div>
              </div>
            ) : null}
             
            {(!event.isRecurring && !isFuture) && (
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-center">
                  <span className="text-white/80 italic text-sm">珍贵的回忆</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;