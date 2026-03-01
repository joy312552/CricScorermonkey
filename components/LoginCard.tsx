
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { InputField } from './InputField';
import { Button } from './Button';

export const LoginCard: React.FC = () => {
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
      return setError('Email and password required.');
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Scorer Console</h2>
        <p className="text-slate-500 font-medium mt-1">Sign in to manage your matches</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
        </div>

        <Button type="submit" className="w-full py-5 text-lg font-black rounded-2xl" loading={loading}>
          Enter Dashboard <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-50 text-center">
        <p className="text-slate-400 text-sm font-medium">
          New official?{' '}
          <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-black underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
