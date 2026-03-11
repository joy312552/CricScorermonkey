
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Mail, 
  Key, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  LogOut,
  Camera,
  AtSign,
  Loader2,
  Power
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  // State for Identity
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  
  // State for Security
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    // Scroll to top to ensure feedback is seen
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setMessage({ text: '', type: '' }), 6000);
  };

  const handleUpdateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          username: username.trim().toLowerCase()
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') throw new Error('This username is already taken. Please choose another.');
        throw error;
      }

      await refreshProfile();
      showFeedback('Profile identity updated successfully!', 'success');
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email === user?.email) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      showFeedback('A verification link has been sent to your new email address.', 'success');
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    if (password.length < 6) {
      return showFeedback('Password must be at least 6 characters.', 'error');
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword('');
      showFeedback('Password changed successfully!', 'success');
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cricket-gray py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb / Back Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-cricket-green transition-colors flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <header className="space-y-1">
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your digital official credentials.</p>
        </header>

        {/* Global Alert Message */}
        {message.text && (
          <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 ${
            message.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-cricket-light border-cricket-green/20 text-cricket-dark'
          }`}>
            {message.type === 'error' ? <AlertCircle className="w-6 h-6 shrink-0" /> : <CheckCircle2 className="w-6 h-6 shrink-0" />}
            <span className="font-bold text-sm">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar: Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="cricket-card p-8 text-center">
              <div className="relative inline-block mb-6">
                 <div className="w-24 h-24 rounded-2xl bg-cricket-green flex items-center justify-center text-white text-4xl font-display font-black shadow-lg shadow-cricket-green/20">
                    {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white border-4 border-white">
                    <Camera className="w-3.5 h-3.5" />
                 </div>
              </div>
              <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-tight">{user.name}</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">@{user.username}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Account Tier</span>
                    <span className="text-cricket-green">Pro Official</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Verified</span>
                    <span className="text-slate-900">Yes</span>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg">
               <ShieldCheck className="w-8 h-8 text-cricket-green mb-4" />
               <h3 className="text-xl font-display font-black tracking-tight mb-2">Privacy Control</h3>
               <p className="text-slate-400 text-xs font-medium leading-relaxed">
                 Your match data and tournament history are encrypted and linked to this unique identity.
               </p>
            </div>

            {/* Logout Section in Sidebar Bottom */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
               <button 
                  onClick={handleLogout}
                  className="w-full py-4 px-4 bg-white hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl flex items-center justify-center gap-3 text-sm font-black text-red-600 uppercase tracking-widest shadow-sm"
               >
                  <Power className="w-4 h-4" /> Sign Out
               </button>
            </div>
          </div>

          {/* Main: Settings Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form: Identity */}
            <section className="cricket-card p-8 md:p-10">
               <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                  <UserIcon className="w-6 h-6 text-cricket-green" />
                  <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Identity Settings</h3>
               </div>
               
               <form onSubmit={handleUpdateIdentity} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField 
                      label="Public Name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. John Doe"
                      required
                    />
                    <InputField 
                      label="Handle (@)" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="unique_handle"
                      required
                    />
                  </div>
                  <Button type="submit" loading={loading} className="cricket-button-primary px-10 py-4">
                    <Save className="w-4 h-4 mr-2 inline-block" /> Update Identity
                  </Button>
               </form>
            </section>

            {/* Form: Email & Security */}
            <section className="cricket-card p-8 md:p-10">
               <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                  <Key className="w-6 h-6 text-cricket-green" />
                  <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Access & Security</h3>
               </div>

               {/* Email Block */}
               <div className="mb-10">
                 <div className="mb-4">
                   <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                     <Mail className="w-4 h-4 text-slate-400" /> Email Address
                   </h4>
                   <p className="text-xs text-slate-400 font-bold mt-1">Updates require confirmation on both old and new addresses.</p>
                 </div>
                 <form onSubmit={handleUpdateEmail} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <InputField 
                        label="" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="new@example.com"
                      />
                    </div>
                    <Button type="submit" variant="outline" loading={loading} className="whitespace-nowrap h-[58px] px-8 rounded-xl border-2 border-slate-200 hover:border-cricket-green hover:text-cricket-green hover:bg-cricket-light">
                      Change Email
                    </Button>
                 </form>
               </div>

               <div className="h-px bg-slate-100 w-full mb-10" />

               {/* Password Block */}
               <div>
                 <div className="mb-4">
                   <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                     <AtSign className="w-4 h-4 text-slate-400" /> New Password
                   </h4>
                   <p className="text-xs text-slate-400 font-bold mt-1">Minimum 6 characters recommended for account safety.</p>
                 </div>
                 <form onSubmit={handleUpdatePassword} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <InputField 
                        label="" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter new secure password"
                      />
                    </div>
                    <Button type="submit" variant="outline" loading={loading} className="whitespace-nowrap h-[58px] px-8 rounded-xl border-2 border-slate-200 hover:border-cricket-green hover:text-cricket-green hover:bg-cricket-light">
                      Update Password
                    </Button>
                 </form>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
