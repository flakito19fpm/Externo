import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Users, Wrench, Clock, CheckCircle, FileText, Eye, DollarSign } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    clients: 0, 
    activeEquip: 0, 
    repairEquip: 0, 
    servicesPending: 0, 
    servicesCompleted: 0, 
    reparaciones: 0, 
    mantenimientos: 0,
    visitas: 0,
    ingresosVisitas: 0,
    revenue: '$0' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: clientsData } = await supabase.from('clientes').select('*');
        const { data: equipData } = await supabase.from('equipos').select('estado');
        const { data: servicesData } = await supabase.from('servicios').select('estado, tipo, cobro');

        const clientsCount = clientsData?.length || 0;
        const activeCount = equipData?.filter(e => e.estado === 'Activo').length || 0;
        const repairCount = equipData?.filter(e => e.estado === 'En Reparación').length || 0;
        const pendingServices = servicesData?.filter(s => s.estado === 'Pendiente' || s.estado === 'En Proceso').length || 0;
        const completedServices = servicesData?.filter(s => s.estado === 'Completado').length || 0;
        const reparaciones = servicesData?.filter(s => s.tipo === 'Reparacion').length || 0;
        const mantenimientos = servicesData?.filter(s => s.tipo.startsWith('Mantenimiento')).length || 0;
        const visitas = servicesData?.filter(s => s.tipo === 'Visita').length || 0;
        const ingresosVisitas = servicesData
          ?.filter(s => s.tipo === 'Visita' && s.estado === 'Completado' && s.cobro > 0)
          ?.reduce((sum, s) => sum + parseFloat(s.cobro || 0), 0) || 0;

        const totalRevenue = ingresosVisitas; // Por ahora solo de visitas, expande con otros cobros

        setStats({
          clients: clientsCount,
          activeEquip: activeCount,
          repairEquip: repairCount,
          servicesPending: pendingServices,
          servicesCompleted: completedServices,
          reparaciones,
          mantenimientos,
          visitas,
          ingresosVisitas: ingresosVisitas.toFixed(2),
          revenue: `$${totalRevenue.toFixed(2)}`
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    { title: 'Clientes Totales', value: stats.clients, icon: Users, color: 'from-amber-400 to-orange-500', link: '/clients' },
    { title: 'Equipos Activos', value: stats.activeEquip, icon: Coffee, color: 'from-green-400 to-emerald-500' },
    { title: 'En Reparación', value: stats.repairEquip, icon: Wrench, color: 'from-yellow-400 to-amber-500' },
    { title: 'Servicios Pendientes', value: stats.servicesPending, icon: Clock, color: 'from-red-400 to-pink-500', link: '/services' },
    { title: 'Servicios Completados', value: stats.servicesCompleted, icon: CheckCircle, color: 'from-blue-400 to-indigo-500' },
    { title: 'Reparaciones', value: stats.reparaciones, icon: Wrench, color: 'from-purple-400 to-pink-500' },
    { title: 'Mantenimientos', value: stats.mantenimientos, icon: Coffee, color: 'from-green-400 to-emerald-500' },
    { title: 'Visitas Cobradas', value: stats.visitas, icon: Eye, color: 'from-orange-400 to-red-500', link: '/services' },
    { title: 'Ingresos Visitas', value: `$${stats.ingresosVisitas}`, icon: DollarSign, color: 'from-green-400 to-emerald-500' },
    { title: 'Ingresos Total Mes', value: stats.revenue, icon: FileText, color: 'from-gray-400 to-gray-500', link: '/reports' }
  ];

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando stats del taller...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-amber-50 via-orange-50 to-brown-50 min-h-screen py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-brown-800 to-amber-700 bg-clip-text text-transparent mb-8 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          Dashboard del Taller
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardStats.slice(0, 6).map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl relative overflow-hidden cursor-pointer ${stat.link ? 'hover:bg-opacity-90' : ''}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => stat.link && (window.location.href = stat.link)}
              >
                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl opacity-20 flex items-center justify-center`} />
                <Icon className="w-8 h-8 text-amber-600 mb-4 relative z-10" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.link && <p className="text-xs text-blue-600 mt-2 underline">Ver detalles</p>}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dashboardStats.slice(6).map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl relative overflow-hidden ${stat.link ? 'cursor-pointer hover:bg-opacity-90' : ''}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: (index + 6) * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => stat.link && (window.location.href = stat.link)}
              >
                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl opacity-20 flex items-center justify-center`} />
                <Icon className="w-8 h-8 text-amber-600 mb-4 relative z-10" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.link && <p className="text-xs text-blue-600 mt-2 underline">Ver detalles</p>}
              </motion.div>
            );
          })}
        </div>

        {stats.clients === 0 && (
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-brown-200/50 text-center max-w-2xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Coffee className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brown-800 mb-4">¡Taller Esperando Órdenes!</h2>
            <p className="text-gray-600 mb-6">Agrega clientes para programar visitas (cobro auto PDC $638, Exterior $1,102) y servicios con Jonathan o Carlos.</p>
            <div className="space-x-4">
              <Link to="/clients" className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                Empezar con Clientes
              </Link>
              <Link to="/services" className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all">
                Nueva Visita PDC ($638)
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;