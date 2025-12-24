import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Calendar, Heart, Type, CheckCircle, Palette } from 'lucide-react';
import { MemoryEvent, ThemeColor } from '../types';
import { THEMES } from '../utils/theme';
import { resizeImage } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

interface AddEventFormProps {
  onClose: () => void;
  onSave: (event: MemoryEvent) => void;
  initialEvent?: MemoryEvent | null;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onClose, onSave, initialEvent }) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [date, setDate] = useState(initialEvent?.date || '');
  const [isRecurring, setIsRecurring] = useState(initialEvent ? initialEvent.isRecurring : true);
  const [image, setImage] = useState<string | null>(initialEvent?.image || null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(initialEvent?.theme || 'rose');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeStyle = THEMES[selectedTheme];
  const isEditing = !!initialEvent;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const resized = await resizeImage(e.target.files[0]);
        setImage(resized);
      } catch (err) {
        console.error("Image processing failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const eventToSave: MemoryEvent = {
      id: initialEvent?.id || uuidv4(),
      title,
      date, 
      image: image || undefined,
      isRecurring,
      theme: selectedTheme
    };

    onSave(eventToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Heart className={`w-5 h-5 ${themeStyle.text} mr-2`} fill="currentColor" />
            {isEditing ? '编辑纪念日' : '新建纪念日'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">我们要庆祝什么？</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：第一次约会，妈妈的生日"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none transition-all ${themeStyle.border} ${themeStyle.ring} focus:ring-2`}
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">日期是哪一天？</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none transition-all ${themeStyle.border} ${themeStyle.ring} focus:ring-2`}
                />
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Palette size={16} className="mr-1 text-gray-400" />
                选择主题颜色
              </label>
              <div className="flex justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
                {(Object.keys(THEMES) as ThemeColor[]).map((key) => {
                  const theme = THEMES[key];
                  const isSelected = selectedTheme === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTheme(key)}
                      className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradient} shrink-0 transition-transform ${isSelected ? 'scale-110 ring-2 ring-offset-2 ring-gray-300' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                      aria-label={theme.label}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <CheckCircle size={16} fill="currentColor" className="text-white/20" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recurring Toggle */}
            <div className={`flex items-center space-x-3 p-3 rounded-xl border border-gray-100 ${themeStyle.lightBg}`}>
               <input 
                  type="checkbox" 
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className={`w-5 h-5 rounded border-gray-300 focus:ring-offset-0 ${themeStyle.text} focus:ring-0`}
               />
               <label htmlFor="recurring" className="text-sm text-gray-700 select-none">
                  <span className="font-medium block">每年重复？</span>
                  <span className="text-xs text-gray-500">开启此项以追踪生日或周年纪念日。</span>
               </label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">添加封面照片</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${image ? 'border-transparent' : `border-gray-300 hover:border-[${themeStyle.text}] ${themeStyle.lightBg} hover:opacity-100`}`}
              >
                {image ? (
                  <>
                    <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">更换照片</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-500">点击上传</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center text-lg ${themeStyle.buttonBg} ${themeStyle.buttonHover} ${themeStyle.shadow} active:scale-[0.98]`}
            >
              {loading ? '处理中...' : (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  {isEditing ? '更新纪念日' : '保存纪念日'}
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;