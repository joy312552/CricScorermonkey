
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, LayoutDashboard, PlayCircle, LogOut, User, Menu, X, MoreVertical, Swords, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isOverlay = location.pathname.includes('/overlay');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop = !desktopProfileRef.current || !desktopProfileRef.current.contains(target);
      const isOutsideMobile = !mobileProfileRef.current || !mobileProfileRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  if (isOverlay) return <>{children}</>;

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Build Your League', path: '/tournaments', icon: Trophy, protected: true },
    { name: 'Create Match', path: '/create-match', icon: PlayCircle, protected: true },
    { name: 'Control Panel', path: '/dashboard', icon: Settings, protected: true }, // Links to dashboard to select a match
    { name: 'Graphics Engine', path: '/dashboard', icon: Swords, protected: true }, // Links to dashboard to select a match
    { name: 'Profile', path: '/profile', icon: User, protected: true },
  ];

  const visibleLinks = navLinks.filter(link => !link.protected || (link.protected && user));

  return (
    <div className="min-h-screen flex flex-col bg-cricket-gray">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm relative overflow-hidden">
        {/* Ball rolling animation in header */}
        <div className="absolute top-0 left-0 w-full h-1 pointer-events-none opacity-20">
          <div className="w-4 h-4 bg-cricket-green rounded-full animate-ball-roll absolute top-0" />
        </div>
        
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-slate-900">
            <span className="text-2xl">🏏</span>
            <span className="tracking-tighter font-display">Blitz Cricket <span className="text-cricket-green">Scorer</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6">
              {visibleLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link text-sm font-semibold tracking-wide ${location.pathname === link.path ? 'text-cricket-green' : 'text-slate-600'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {user ? (
              <div className="relative" ref={desktopProfileRef}>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-cricket-green transition-colors">Login</Link>
                <Button onClick={() => navigate('/signup')} className="cricket-button-primary text-sm">Create Account</Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Area */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="relative" ref={mobileProfileRef}>
                <button 
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    if (isMenuOpen) setIsMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl transition-all ${isProfileOpen ? 'bg-slate-100' : 'text-slate-400'}`}
                >
                  <MoreVertical className="w-6 h-6" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-[100]">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 uppercase tracking-widest"
                    >
                      <User className="w-4 h-4 text-emerald-600" /> My Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 uppercase tracking-widest"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Dashboard
                    </Link>
                    <div className="h-px bg-slate-50 my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-xs font-black text-red-500 hover:bg-red-50 uppercase tracking-widest"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button className="text-slate-500 p-2 bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sidebar */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 fixed top-[72px] left-0 right-0 bottom-0 z-40 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
             {user && (
               <button 
                onClick={() => {
                  navigate('/profile');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] mb-6 text-left hover:bg-slate-100 transition-colors"
               >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 leading-none">{user.name}</p>
                    <p className="text-sm font-bold text-slate-400 mt-1">@{user.username}</p>
                  </div>
               </button>
             )}
             
             <div className="flex-1 space-y-2">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-4 text-sm font-black text-slate-700 py-4 px-6 rounded-2xl hover:bg-slate-50 uppercase tracking-widest"
                  >
                    <link.icon className="w-5 h-5 text-emerald-600" />
                    {link.name}
                  </Link>
                ))}
             </div>

              <div className="pt-8 mt-auto border-t border-slate-100">
                {!user ? (
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" onClick={() => navigate('/login')} className="py-4">Login</Button>
                    <Button onClick={() => navigate('/signup')} className="py-4">Create Account</Button>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-[2rem] p-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full py-5 font-black text-red-500 bg-white shadow-sm border border-red-100 rounded-[1.8rem] flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-3xl font-black text-slate-900">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span>CricScore <span className="text-emerald-600">Pro</span></span>
            </div>
            <p className="text-slate-500 text-lg max-w-sm font-medium leading-relaxed">
              Elevating local cricket through professional digital tools and real-time broadcasting.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Platform</h4>
                <div className="flex flex-col gap-3">
                   <Link to="/dashboard" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">Dashboard</Link>
                   <Link to="/matches" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">Matches</Link>
                   <Link to="/tournaments" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">Leagues</Link>
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Account</h4>
                <div className="flex flex-col gap-3">
                   <Link to="/profile" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">Settings</Link>
                   <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">Login</Link>
                   <Link to="/signup" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">Join Pro</Link>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">&copy; 2024 CricScore Pro Ecosystem. Built for the Game.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
             <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
             <a href="#" className="hover:text-emerald-600 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
