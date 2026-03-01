
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Please provide both email and password.');
    }

    setLoading(true);
    try {
      await login(email, password);
      // Replace history so they can't go back to login form
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50/50">
      <div className="w-full max-w-md bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-emerald-600 shadow-xl shadow-emerald-200 mb-6">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Authorized Login</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Elite Scorer Access</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Official Email"
            type="email"
            placeholder="scorer@cricscore.pro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            label="Secure Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full py-5 rounded-[2rem]" loading={loading}>
            Sign In to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-sm font-medium">
            New league official?{' '}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-black underline underline-offset-4">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
