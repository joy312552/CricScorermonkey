
import React from 'react';
import { Share2, ExternalLink, Globe, Tv } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface BroadcastToolsProps {
  matchId: string;
  isPublic: boolean;
  onTogglePublic: () => void;
}

export const BroadcastTools: React.FC<BroadcastToolsProps> = ({ matchId, isPublic, onTogglePublic }) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  
  const overlayUrl = `${cleanBaseUrl}#/overlay/${matchId}`;
  const scoreUrl = `${cleanBaseUrl}#/scoreboard/${matchId}`;

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-emerald-50 transition-colors" />
      
      <div className="relative z-10 space-y-10">
        {/* Connection Tools */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Broadcast Links</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect to OBS & Fans</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${isPublic ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
                  {isPublic ? 'Public' : 'Private'}
               </span>
               <button 
                onClick={onTogglePublic}
                className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-emerald-500 transition-all uppercase tracking-widest"
               >
                  Toggle
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-[1.8rem] border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OBS Browser Source</span>
                 </div>
                 <a href={overlayUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-emerald-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                 </a>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-[11px] text-slate-400 font-bold truncate">
                    {overlayUrl}
                 </div>
                 <CopyButton text={overlayUrl} />
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-[1.8rem] border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Scoreboard</span>
                 </div>
                 <a href={scoreUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                 </a>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-[11px] text-slate-400 font-bold truncate">
                    {scoreUrl}
                 </div>
                 <CopyButton text={scoreUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
