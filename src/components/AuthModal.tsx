import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, UserRoundPlus } from 'lucide-react';
import { User } from '../types';
import { apiLogin, apiRegister } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  demoMode?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, demoMode = false }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('Aluno');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const clearForm = () => {
    setName('');
    setIdentifier('');
    setPassword('');
    setRole('Aluno');
    setError('');
  };

  const changeMode = (next: 'login' | 'register') => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const value = identifier.trim();
    if (!value || !password) {
      setError('Preencha o e-mail e a palavra-passe para continuar.');
      return;
    }
    if (mode === 'register' && name.trim().length < 2) {
      setError('Introduza o seu nome completo.');
      return;
    }
    if (!demoMode && password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      if (demoMode) {
        // Demo identities exist only in the local development preview.
        const key = value.toLowerCase();
        const demoRole: User['role'] = /admin|administrador/.test(key)
          ? 'Administrador'
          : /formador|trainer|professor/.test(key)
          ? 'Formador'
          : 'Aluno';
        const rawName = (value.includes('@') ? value.split('@')[0] : value).replace(/[._-]+/g, ' ').trim();
        const displayName = rawName.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase()) || 'Utilizador Demo';
        const email = value.includes('@') ? value.toLowerCase() : value.toLowerCase().replace(/\s+/g, '.') + '@demo.local';
        const id = demoRole === 'Administrador' ? 'demo-admin' : demoRole === 'Formador' ? 'demo-trainer' : 'demo-student-' + email.replace(/[^a-z0-9]/g, '-').slice(0, 36);
        onLoginSuccess({
          id, name: displayName, email, role: demoRole, status: 'Ativo',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        });
      } else if (mode === 'register') {
        const result = await apiRegister({ name: name.trim(), email: value.toLowerCase(), password, role });
        onLoginSuccess(result.user);
        if (result.user.status === 'Pendente') {
          window.alert('Conta criada. A candidatura de formador precisa de aprovação antes de publicar cursos.');
        }
      } else {
        const result = await apiLogin({ email: value.toLowerCase(), password });
        onLoginSuccess(result.user);
      }
      clearForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir a operação. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="auth-title" className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#185a7d]">A sua conta</p>
            <h2 id="auth-title" className="text-lg font-bold text-[#0c2340]">{mode === 'login' ? 'Entrar na Edu-Nobre' : 'Criar conta'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#185a7d]"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {demoMode ? (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" />
              <p className="text-xs leading-relaxed text-amber-900">Pré-visualização local: qualquer palavra-passe funciona. Escreva <strong>admin</strong> para testar o painel, <strong>formador</strong> para testar a criação de conteúdos ou qualquer outro nome para entrar como aluno. Isto não é autenticação de produção.</p>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-[#185a7d] shrink-0" />
              <p className="text-xs leading-relaxed text-slate-600">A sua conta fica associada ao seu e-mail. As candidaturas de formador são analisadas antes de poder publicar cursos.</p>
            </div>
          )}

          {mode === 'register' && !demoMode && (
            <>
              <div className="space-y-1.5">
                <label htmlFor="auth-name" className="block text-xs font-semibold text-[#26211e]">Nome completo</label>
                <input id="auth-name" type="text" autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="O seu nome" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#0c2340]" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="auth-role" className="block text-xs font-semibold text-[#26211e]">Quero utilizar a plataforma como</label>
                <select id="auth-role" value={role} onChange={(event) => setRole(event.target.value as User['role'])} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#0c2340]">
                  <option value="Aluno">Aluno — aprender e descarregar materiais</option>
                  <option value="Formador">Formador — submeter cursos para aprovação</option>
                  <option value="Afiliado">Afiliado — divulgar cursos</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="block text-xs font-semibold text-[#26211e]">{demoMode ? 'Utilizador ou e-mail' : 'E-mail'}</label>
            <input id="auth-email" type={demoMode ? 'text' : 'email'} autoComplete="username" required maxLength={254} value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={demoMode ? 'admin, formador ou o seu nome' : 'nome@exemplo.ao'} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#0c2340]" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="block text-xs font-semibold text-[#26211e]">Palavra-passe</label>
            <input id="auth-password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={demoMode ? undefined : 8} maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={demoMode ? 'Qualquer palavra-passe' : 'Mínimo de 8 caracteres'} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#0c2340]" />
          </div>

          {error && <p role="alert" className="text-xs font-medium text-red-700">{error}</p>}

          <button type="submit" disabled={busy} className="w-full min-h-11 rounded-full bg-[#185a7d] hover:bg-[#12415b] disabled:opacity-60 text-white text-sm font-semibold px-4 py-3 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#185a7d]">
            {busy ? 'A processar…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            {mode === 'register' ? <UserRoundPlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          {!demoMode && (
            <p className="text-xs text-center text-slate-600">
              {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}{' '}
              <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')} className="font-semibold text-[#185a7d] hover:underline">
                {mode === 'login' ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          )}
          {!demoMode && <p className="text-[10px] leading-relaxed text-slate-500">A recuperação de palavra-passe e a verificação de e-mail ainda precisam de ser configuradas antes do lançamento público.</p>}
        </form>
      </div>
    </div>
  );
};
