
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !username || !email || !password) {
      return setError('All fields are required.');
    }
    if (username.length < 3) {
      return setError('Username must be at least 3 characters.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await signup(name, username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50/50">
      <div className="w-full max-w-md bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-emerald-600 shadow-xl shadow-emerald-200 mb-6">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Official Registration</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Join the Scorer Network</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField 
            label="Full Name" 
            placeholder="John Doe" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <InputField 
            label="Username" 
            placeholder="johndoe88" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <InputField 
            label="Email Address" 
            type="email" 
            placeholder="official@cricscore.pro" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <InputField 
            label="Password" 
            type="password" 
            placeholder="Minimum 6 characters" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <Button type="submit" className="w-full py-5 rounded-2xl" loading={loading}>
            Create My Account <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Already have an account?{' '}
            <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-black underline underline-offset-4">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
