import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = identifier.trim();
    if (!value || !password.trim()) {
      setError('Preencha os dois campos para entrar.');
      return;
    }

    // Demo access only. Production authentication must be verified by the backend.
    const key = value.toLowerCase();
    const role: User['role'] = /admin|administrador/.test(key)
      ? 'Administrador'
      : /formador|trainer|professor/.test(key)
      ? 'Formador'
      : 'Aluno';
    const rawName = (value.includes('@') ? value.split('@')[0] : value).replace(/[._-]+/g, ' ').trim();
    const displayName = rawName.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase()) || 'Utilizador Demo';
    const email = value.includes('@') ? value.toLowerCase() : value.toLowerCase().replace(/\s+/g, '.') + '@demo.local';
    const id = role === 'Administrador' ? 'demo-admin' : role === 'Formador' ? 'demo-trainer' : 'demo-student-' + email.replace(/[^a-z0-9]/g, '-').slice(0, 36);

    onLoginSuccess({
      id,
      name: displayName,
      email,
      role,
      status: 'Ativo',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    });
    setIdentifier('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="auth-title" className="bg-white rounded-2xl max-w-sm w-full border border-[#e2d5c8] shadow-xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#eee7e0]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#8c3a27]">A sua conta</p>
            <h2 id="auth-title" className="text-lg font-bold text-[#1a1a1a]">Entrar</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#f4eee8] focus-visible:ring-2 focus-visible:ring-[#185a7d]"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="rounded-xl bg-[#f7f3ee] px-3.5 py-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-[#185a7d] shrink-0" />
            <p className="text-xs leading-relaxed text-[#51463e]">Modo de teste: qualquer palavra-passe funciona. Use <strong>admin</strong> para o painel, <strong>formador</strong> para submeter conteúdos ou outro nome para entrar como aluno.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="demo-identifier" className="block text-xs font-semibold text-[#26211e]">Utilizador ou e-mail</label>
            <input id="demo-identifier" type="text" autoComplete="username" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="O seu utilizador" className="w-full rounded-xl border border-[#e2d5c8] bg-white px-3.5 py-3 text-sm text-[#1a1a1a]" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="demo-password" className="block text-xs font-semibold text-[#26211e]">Palavra-passe</label>
            <input id="demo-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Qualquer palavra-passe" className="w-full rounded-xl border border-[#e2d5c8] bg-white px-3.5 py-3 text-sm text-[#1a1a1a]" />
          </div>
          {error && <p role="alert" className="text-xs font-medium text-red-700">{error}</p>}
          <button type="submit" className="w-full min-h-11 rounded-full bg-[#be462a] hover:bg-[#a53b21] text-white text-sm font-semibold px-4 py-3 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#185a7d]">Entrar <ArrowRight className="w-4 h-4" /></button>
          <p className="text-[10px] leading-relaxed text-[#746b65]">Contas e ficheiros de teste ficam neste navegador. Não use dados pessoais reais.</p>
        </form>
      </div>
    </div>
  );
};
