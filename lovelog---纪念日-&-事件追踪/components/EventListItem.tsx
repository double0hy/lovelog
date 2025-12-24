import React from 'react';
import { MemoryEvent } from '../types';
import { calculateDateDetails, formatDateDisplay } from '../utils/dateUtils';
import { THEMES } from '../utils/theme';
import { Edit2, Trash2, Calendar, RefreshCw } from 'lucide-react';

interface EventListItemProps {
  event: MemoryEvent;
  onEdit: (event: MemoryEvent) => void;
  onDelete: (id: string) => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onEdit, onDelete }) => {
  const { daysSince, daysUntilNext, isFuture } = calculateDateDetails(event.date, event.isRecurring);
  const theme = THEMES[event.theme || 'rose'];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4 mb-3 transition-all hover:shadow-md active:scale-[0.99]">
      {/* Icon / Image */}
      <div className={`w-12 h-12 rounded-xl shrink-0 overflow-hidden flex items-center justify-center ${theme.lightBg} ${theme.text} ring-2 ring-white shadow-sm`}>
        {event.image ? (
          <img src={event.image} alt="" className="w-full h-full object-cover" />
        ) : (
          event.isRecurring ? <RefreshCw size={20} /> : <Calendar size={20} />
        )}
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 truncate text-base">{event.title}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{formatDateDisplay(event.date)}</p>
      </div>

      {/* Days Badge */}
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${theme.lightBg} ${theme.text} whitespace-nowrap`}>
        {isFuture ? `${daysUntilNext} 天后` : `${daysSince} 天`}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1 pl-2 border-l border-gray-100 ml-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(event); }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="编辑"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          aria-label="删除"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default EventListItem;