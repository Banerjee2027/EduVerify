import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import { Shield, LayoutDashboard, LogOut, Verified, User } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  user: UserProfile | null;
  onLogout: () => void;
  onLogin: () => void;
}

export default function Header({ user, onLogout, onLogin }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">EduVerify</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Home
          </Link>
          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              {user.role === 'educator' && (
                <Link 
                  to="/verify" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === '/verify' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Verified className="h-4 w-4" />
                  Verifications
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{user.role}</p>
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full ring-2 ring-blue-50"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={onLogin}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={onLogin}
                className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-shadow hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-transform"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
