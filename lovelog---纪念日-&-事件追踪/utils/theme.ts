import { ThemeColor } from '../types';

export const THEMES: Record<ThemeColor, {
  label: string;
  gradient: string;
  buttonBg: string;
  buttonHover: string;
  text: string;
  lightBg: string;
  ring: string;
  border: string;
  shadow: string;
}> = {
  rose: { 
    label: '浪漫粉', 
    gradient: 'from-pink-300 to-rose-400', 
    buttonBg: 'bg-rose-500', 
    buttonHover: 'hover:bg-rose-600',
    text: 'text-rose-500', 
    lightBg: 'bg-rose-50',
    ring: 'focus:ring-rose-200',
    border: 'focus:border-rose-500',
    shadow: 'shadow-rose-500/30'
  },
  sky: { 
    label: '宁静蓝', 
    gradient: 'from-sky-300 to-blue-400', 
    buttonBg: 'bg-sky-500', 
    buttonHover: 'hover:bg-sky-600',
    text: 'text-sky-500', 
    lightBg: 'bg-sky-50',
    ring: 'focus:ring-sky-200',
    border: 'focus:border-sky-500',
    shadow: 'shadow-sky-500/30'
  },
  violet: { 
    label: '梦幻紫', 
    gradient: 'from-violet-300 to-purple-400', 
    buttonBg: 'bg-violet-500', 
    buttonHover: 'hover:bg-violet-600',
    text: 'text-violet-500', 
    lightBg: 'bg-violet-50',
    ring: 'focus:ring-violet-200',
    border: 'focus:border-violet-500',
    shadow: 'shadow-violet-500/30'
  },
  amber: { 
    label: '温暖橘', 
    gradient: 'from-amber-300 to-orange-400', 
    buttonBg: 'bg-amber-500', 
    buttonHover: 'hover:bg-amber-600',
    text: 'text-amber-500', 
    lightBg: 'bg-amber-50',
    ring: 'focus:ring-amber-200',
    border: 'focus:border-amber-500',
    shadow: 'shadow-amber-500/30'
  },
  emerald: { 
    label: '清新绿', 
    gradient: 'from-emerald-300 to-teal-400', 
    buttonBg: 'bg-emerald-500', 
    buttonHover: 'hover:bg-emerald-600',
    text: 'text-emerald-500', 
    lightBg: 'bg-emerald-50',
    ring: 'focus:ring-emerald-200',
    border: 'focus:border-emerald-500',
    shadow: 'shadow-emerald-500/30'
  },
  slate: { 
    label: '经典灰', 
    gradient: 'from-slate-300 to-gray-400', 
    buttonBg: 'bg-slate-500', 
    buttonHover: 'hover:bg-slate-600',
    text: 'text-slate-500', 
    lightBg: 'bg-slate-50',
    ring: 'focus:ring-slate-200',
    border: 'focus:border-slate-500',
    shadow: 'shadow-slate-500/30'
  }
};