import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Settings, FileText } from 'lucide-react';

const AppLayout = () => {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/services', label: 'Servicios', icon: Settings },
    { path: '/reports', label: 'Reportes', icon: FileText }
  ];

  return (
    <>
      <motion.nav 
        className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-amber-200/50 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brown-800 to-amber-600 bg-clip-text text-transparent">
              CoffeeFix Pro
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-brown-800 hover:bg-amber-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
            <button className="md:hidden p-2 bg-amber-400 rounded-xl text-white">
              ☰
            </button>
          </div>
        </div>
      </motion.nav>

      <main className="pt-4">
        <Outlet />
      </main>

      <motion.footer 
        className="bg-gradient-to-r from-brown-800 to-amber-700 text-white py-8 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2024 CoffeeFix Pro. Visitas, mantenimientos y reparaciones con Jonathan y Carlos. ☕</p>
        </div>
      </motion.footer>
    </>
  );
};

export default AppLayout;