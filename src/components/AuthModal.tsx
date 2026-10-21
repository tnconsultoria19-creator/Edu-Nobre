import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Aluno' | 'Formador' | 'Afiliado'>('Aluno');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0] || 'Utilizador',
      email,
      role,
    };
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#e2d5c8] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-extrabold text-[#f0a67d] tracking-wider">
              Área de Membros Edunombre
            </div>
            <h2 className="text-xl font-black font-outfit">
              {isRegister ? 'Criar Nova Conta' : 'Iniciar Sessão'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold text-[#1a1a1a] mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Pedro Miguel"
                  className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 pl-9 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
                />
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#858586]" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#1a1a1a] mb-1">
              Endereço de E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 pl-9 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#858586]" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1a1a1a] mb-1">
              Palavra-passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl p-3 pl-9 text-xs text-[#1a1a1a] focus:border-[#be462a] focus:outline-none"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-[#858586]" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block font-bold text-[#1a1a1a] mb-1">
                Tipo de Perfil
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Aluno', 'Formador', 'Afiliado'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      role === r
                        ? 'bg-[#be462a] text-white border-[#be462a]'
                        : 'bg-[#f7f3ee] border-[#e2d5c8] text-[#858586]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#be462a] hover:bg-[#a53b21] text-white text-xs font-bold py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isRegister ? 'Criar Conta' : 'Entrar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-[#be462a] hover:underline cursor-pointer"
            >
              {isRegister
                ? 'Já tem conta? Inicie sessão aqui.'
                : 'Ainda não tem conta? Registar agora.'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
