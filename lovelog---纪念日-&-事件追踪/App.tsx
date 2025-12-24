import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import { MemoryEvent } from './types';
import EventCard from './components/EventCard';
import EventListItem from './components/EventListItem';
import AddEventForm from './components/AddEventForm';

const App: React.FC = () => {
  const [events, setEvents] = useState<MemoryEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MemoryEvent | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('loveLogEvents');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('loveLogEvents', JSON.stringify(events));
  }, [events]);

  const handleSaveEvent = (event: MemoryEvent) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === event.id);
      if (exists) {
        // Update existing
        return prev.map(e => e.id === event.id ? event : e);
      } else {
        // Add new
        return [event, ...prev];
      }
    });
    setShowAddModal(false);
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    if (confirm("你确定要删除这个纪念日吗？")) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setShowAddModal(true);
  };

  const openEditModal = (event: MemoryEvent) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg min-h-screen bg-white shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-6 bg-white sticky top-0 z-30 border-b border-gray-50/50 backdrop-blur-sm bg-white/90">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-1">你的珍藏</p>
              <h1 className="text-3xl font-bold text-gray-900 serif">LoveLog</h1>
            </div>
            <div className="flex items-center space-x-3">
              {events.length > 0 && (
                <button 
                  onClick={() => setViewMode(prev => prev === 'card' ? 'list' : 'card')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title={viewMode === 'card' ? "切换到列表视图" : "切换到卡片视图"}
                >
                  {viewMode === 'card' ? <LayoutList size={22} /> : <LayoutGrid size={22} />}
                </button>
              )}
              <div className="text-right">
                <span className="text-3xl font-bold text-rose-500">{events.length}</span>
                <span className="text-gray-400 text-sm ml-1 font-medium">个事件</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto pb-24">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Plus size={32} className="text-rose-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">还没有记录</h3>
              <p className="text-gray-500 mb-8">添加你的第一个事件，开始记录美好时光。</p>
              <button 
                onClick={openAddModal}
                className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
              >
                创建第一个纪念日
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {viewMode === 'card' ? (
                // Card View
                events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={deleteEvent}
                    onEdit={openEditModal}
                  />
                ))
              ) : (
                // List View
                <div className="space-y-3">
                  {events.map(event => (
                    <EventListItem 
                      key={event.id} 
                      event={event} 
                      onDelete={deleteEvent}
                      onEdit={openEditModal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 lg:absolute lg:bottom-8 lg:right-8 z-40">
           <button
            onClick={openAddModal}
            className="w-14 h-14 bg-rose-500 text-white rounded-full shadow-xl shadow-rose-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300"
            title="添加新事件"
           >
             <Plus size={28} strokeWidth={2.5} />
           </button>
        </div>

        {/* Modal */}
        {showAddModal && (
          <AddEventForm 
            onClose={() => { setShowAddModal(false); setEditingEvent(null); }} 
            onSave={handleSaveEvent}
            initialEvent={editingEvent}
          />
        )}

      </div>
    </div>
  );
};

export default App;