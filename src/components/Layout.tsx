import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Aulas Diárias', href: '/dashboard', icon: '📚' },
    { name: 'Plano Anual', href: '/annual-plan', icon: '📅' },
    { name: 'Sequência Didática', href: '/didactic-sequence', icon: '📋' },
    { name: 'Avaliações', href: '/assessments', icon: '📝' },
    { name: 'Atividades', href: '/activities', icon: '🎯' },
    { name: 'Relatório de Desenvolvimento', href: '/student-report', icon: '📊' },
    { name: 'Biblioteca de Materiais', href: '/existing-materials', icon: '📂' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-white font-semibold text-lg">Gerador de Planos</span>
          </div>

          {/* User info */}
          {user && (
            <div className="px-4 py-3 bg-blue-50 border-b">
              <p className="text-sm text-gray-600">Bem-vindo,</p>
              <p className="font-medium text-gray-900">{user.name}</p>
              {/* <p className="text-sm text-blue-600">Créditos: {user.credits}</p> */}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
            >
              <span className="mr-2">🚪</span>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 font-semibold text-gray-900">Gerador de Planos</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;