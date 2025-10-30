import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Settings, FileText, Layout } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/services', icon: Settings, label: 'Servicios' },
    { path: '/reports', icon: FileText, label: 'Reportes' }
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:static md:translate-x-0"
    >
      <div className="flex h-full flex-col py-4">
        <div className="px-4 mb-8">
          <h1 className="text-xl font-bold text-gray-800">TechFix Pro</h1>
        </div>
        <nav className="flex-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;