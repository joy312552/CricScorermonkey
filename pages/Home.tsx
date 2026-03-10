
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Trophy, 
  LayoutDashboard, 
  ArrowRight, 
  CheckCircle2,
  Swords,
  TrendingUp,
  Monitor,
  Target,
  Lock,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCard } from '../components/LoginCard';
import { FeatureCard } from '../components/FeatureCard';
import { Button } from '../components/Button';
import { MatchService } from '../services/MatchService';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';

export const Home: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    MatchService.getPublicLiveMatches()
      .then(setLiveMatches)
      .finally(() => setLoadingMatches(false));
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Ball-by-ball updates with sub-100ms latency powered by Supabase Realtime.",
      color: "bg-amber-500"
    },
    {
      icon: Monitor,
      title: "OBS Integration",
      description: "Dedicated transparent browser sources for professional live streaming setups.",
      color: "bg-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Deep Analytics",
      description: "Automated calculations for Run Rates, Economy, and Strike Rates as you score.",
      color: "bg-blue-600"
    },
    {
      icon: Trophy,
      title: "Tournament Hub",
      description: "Manage rosters, tournament brackets, and season history from one dashboard.",
      color: "bg-purple-600"
    },
    {
      icon: Target,
      title: "Smart Rotation",
      description: "Automatic striker switches for odd runs and ending of overs.",
      color: "bg-rose-600"
    },
    {
      icon: Lock,
      title: "Cloud Backup",
      description: "Your match data is saved instantly to the cloud. Never lose a scorecard again.",
      color: "bg-slate-900"
    }
  ];

  if (authLoading) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header with Login Form */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-emerald-600 text-[10px] font-black uppercase tracking-[0.4em]">
                <Swords className="w-4 h-4 fill-emerald-600" /> Professional Grade
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                Digital <br />
                <span className="text-emerald-600">Cricket Console.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Broadcast live scores to OBS with zero delay. The ultimate tool for local leagues and streaming professionals.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4 max-w-md mx-auto lg:mx-0">
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 100% Realtime
                 </div>
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> OBS Overlay
                 </div>
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Stats Engine
                 </div>
                 <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Cloud Sync
                 </div>
              </div>

              {!user && (
                <div className="pt-8">
                  <Button onClick={() => navigate('/signup')} className="px-12 py-5 rounded-[2rem] text-lg">
                    Start Scoring Now <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </div>

            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
               {user ? (
                 <div className="w-full max-w-md bg-emerald-600 p-12 rounded-[3rem] text-white shadow-2xl shadow-emerald-200">
                    <LayoutDashboard className="w-12 h-12 mb-6" />
                    <h2 className="text-3xl font-black mb-4 tracking-tighter">Welcome back, {user.name}</h2>
                    <p className="text-emerald-100 font-medium mb-10 leading-relaxed opacity-80">You're logged in as an official scorer. Access your matches and OBS overlays from your dashboard.</p>
                    <Button variant="secondary" onClick={() => navigate('/dashboard')} className="w-full bg-white text-emerald-600 hover:bg-emerald-50 rounded-[2rem] py-5">
                       Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                 </div>
               ) : (
                 <LoginCard />
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Live Feed</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Matches <span className="text-emerald-600">On-Air</span></h2>
            </div>
            <Link to="/dashboard" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingMatches ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Subtle empty state while loading */}
             </div>
          ) : liveMatches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveMatches.map(m => (
                <MatchCard key={m.id} match={m} canEdit={false} />
              ))}
            </div>
          ) : (
            <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <Play className="w-12 h-12 text-slate-200 mx-auto mb-6" />
               <p className="text-slate-400 font-bold">No matches are currently being scored live.</p>
               <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest font-black">Check back soon for upcoming tournaments</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
             <div className="w-12 h-1.5 bg-emerald-600 mx-auto rounded-full" />
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Everything for your <span className="text-emerald-600">Broadcast.</span>
             </h2>
             <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Stream like the pros. Automated statistics and beautiful overlays integrated with a powerful scoring engine.
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
