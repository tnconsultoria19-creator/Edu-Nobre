import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

interface LocalAccount {
  user: User;
  passwordDigest: string;
}

const ACCOUNT_STORE_KEY = 'edunombre_accounts_v1';

async function digestPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function loadAccounts(): LocalAccount[] {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNT_STORE_KEY) || '[]') as LocalAccount[];
  } catch {
    return [];
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Aluno' | 'Formador' | 'Afiliado'>('Aluno');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const resetMode = () => {
    setIsRegister((current) => !current);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const accounts = loadAccounts();
      const existing = accounts.find((account) => account.user.email.toLowerCase() === normalizedEmail);

      if (isRegister) {
        if (!name.trim()) throw new Error('Introduza o seu nome completo.');
        if (password.length < 8) throw new Error('A palavra-passe deve ter pelo menos 8 caracteres.');
        if (existing) throw new Error('Já existe uma conta com este e-mail. Inicie sessão.');
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          role,
          status: role === 'Formador' ? 'Pendente' : 'Ativo',
        };
        const passwordDigest = await digestPassword(password);
        window.localStorage.setItem(ACCOUNT_STORE_KEY, JSON.stringify([...accounts, { user: newUser, passwordDigest } satisfies LocalAccount]));
        onLoginSuccess(newUser);
        onClose();
        return;
      }

      if (!existing) throw new Error('Não encontrámos uma conta para este e-mail. Crie uma conta primeiro.');
      const digest = await digestPassword(password);
      if (digest !== existing.passwordDigest) throw new Error('E-mail ou palavra-passe incorrectos.');
      if (existing.user.status === 'Bloqueado') throw new Error('Esta conta está bloqueada. Contacte o administrador.');
      onLoginSuccess(existing.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir o pedido.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#e2d5c8] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <div className="bg-[#1a1a1a] text-white p-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-[#d6b990] tracking-wider">Área de Membros Edunombre</div>
            <h2 className="text-xl font-bold font-outfit">{isRegister ? 'Criar Nova Conta' : 'Iniciar Sessão'}</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {isRegister && <div>
            <label className="block font-semibold text-[#26211e] mb-1.5">Nome Completo</label>
            <div className="relative">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Pedro Miguel" className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 pl-10 text-sm text-[#1a1a1a] focus:border-[#be462a] focus:outline-none" />
              <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-[#858586]" />
            </div>
          </div>}

          <div>
            <label className="block font-semibold text-[#26211e] mb-1.5">Endereço de E-mail</label>
            <div className="relative">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.email@exemplo.com" autoComplete="email" className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 pl-10 text-sm text-[#1a1a1a] focus:border-[#be462a] focus:outline-none" />
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#858586]" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#26211e] mb-1.5">Palavra-passe</label>
            <div className="relative">
              <input type="password" required minLength={isRegister ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isRegister ? 'Mínimo de 8 caracteres' : 'A sua palavra-passe'} autoComplete={isRegister ? 'new-password' : 'current-password'} className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 pl-10 text-sm text-[#1a1a1a] focus:border-[#be462a] focus:outline-none" />
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#858586]" />
            </div>
          </div>

          {isRegister && <div>
            <label className="block font-semibold text-[#26211e] mb-1.5">Quero registar-me como</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Aluno', 'Formador', 'Afiliado'] as const).map((choice) => (
                <button key={choice} type="button" onClick={() => setRole(choice)} className={`py-2.5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors ${role === choice ? 'bg-[#be462a] text-white border-[#be462a]' : 'bg-[#f7f3ee] border-[#e2d5c8] text-[#655b54] hover:border-[#be462a]'}`}>
                  {choice}
                </button>
              ))}
            </div>
            {role === 'Formador' && <p className="text-xs text-[#7b5b37] mt-2">As candidaturas de formador precisam de aprovação antes de poder submeter cursos.</p>}
          </div>}

          {error && <div role="alert" className="flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm text-rose-700"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span></div>}

          <button type="submit" disabled={busy} className="w-full bg-[#be462a] hover:bg-[#a53b21] disabled:opacity-60 text-white text-sm font-semibold py-3.5 rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2">
            <span>{busy ? 'A processar…' : isRegister ? 'Criar Conta' : 'Entrar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-1">
            <button type="button" onClick={resetMode} className="text-sm font-semibold text-[#be462a] hover:underline cursor-pointer">
              {isRegister ? 'Já tem conta? Inicie sessão.' : 'Ainda não tem conta? Registar agora.'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
