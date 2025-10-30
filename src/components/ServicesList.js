import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle2, Clock, AlertTriangle, Plus, Eye, Wrench } from 'lucide-react';
import AddServiceModal from './AddServiceModal';
import { supabase } from '../utils/supabase';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTipo, setInitialTipo] = useState('Reparacion');
  const [isVisitaMode, setIsVisitaMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicios')
        .select('*, cliente:cliente_id(*), equipo:equipo_id(*)')
        .order('assigned_date', { ascending: false });
      
      if (servicesError) throw servicesError;

      const { data: clientsData, error: clientsError } = await supabase.from('clientes').select('*');
      if (clientsError) throw clientsError;

      const { data: equipmentsData, error: equipmentsError } = await supabase.from('equipos').select('*');
      if (equipmentsError) throw equipmentsError;

      setServices(servicesData || []);
      setClients(clientsData || []);
      setEquipments(equipmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModalForVisita = () => {
    setInitialTipo('Visita');
    setIsVisitaMode(true);
    setIsModalOpen(true);
  };

  const openModalForServicio = () => {
    setInitialTipo('Reparacion');
    setIsVisitaMode(false);
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.cliente?.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.equipo?.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.tecnico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || service.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'Pendiente', label: 'Pendientes' },
    { value: 'En Proceso', label: 'En Proceso' },
    { value: 'Completado', label: 'Completados' }
  ];

  const getStatusIcon = (status) => {
    if (status === 'Completado') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'En Proceso') return <Clock className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Mantenimiento preventivo': return 'bg-blue-100 text-blue-800';
      case 'Mantenimiento General': return 'bg-green-100 text-green-800';
      case 'Reconstruccion': return 'bg-purple-100 text-purple-800';
      case 'Reparacion': return 'bg-red-100 text-red-800';
      case 'Visita': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCobroDisplay = (service) => {
    if (service.cobro > 0) {
      return `Cobro: $${service.cobro}`;
    }
    return null;
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="py-8 bg-gradient-to-br from-orange-50 via-brown-50 to-amber-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-lg"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-brown-600 bg-clip-text text-transparent">
            Gestión de Servicios y Visitas
          </h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, técnico, zona, cobro o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
              />
            </div>
            <div className="flex space-x-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`px-3 py-2 rounded-xl transition-all text-sm ${
                    filterStatus === option.value
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <motion.div className="flex gap-2">
              <motion.button
                onClick={openModalForVisita}
                className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl text-white hover:shadow-lg transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5" />
                <span className="hidden sm:inline">Nueva Visita</span>
              </motion.button>
              <motion.button
                onClick={openModalForServicio}
                className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white hover:shadow-lg transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wrench className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo Servicio</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(service.estado)}`}>
                    {getStatusIcon(service.estado)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-brown-800 text-lg mb-1 line-clamp-2">{service.descripcion}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(service.tipo)}`}>
                      {service.tipo === 'Visita' ? '👁️ Visita' : service.tipo}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Cliente: {service.cliente?.nombre_cliente} | Equipo: {service.equipo?.marca || 'General'} {service.equipo?.modelo || ''}
              </p>
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div className="flex justify-between">
                  <span>Técnico:</span>
                  <span className="font-medium text-brown-800">{service.tecnico}</span>
                </div>
                <div className="flex justify-between">
                  <span>Asignado:</span>
                  <span>{new Date(service.assigned_date).toLocaleDateString('es-MX')}</span>
                </div>
                {service.estimated_completion && (
                  <div className="flex justify-between">
                    <span>Estimado:</span>
                    <span>{new Date(service.estimated_completion).toLocaleDateString('es-MX')}</span>
                  </div>
                )}
                {getCobroDisplay(service) && (
                  <div className="flex justify-between">
                    <span>Cobro:</span>
                    <span className="font-medium text-green-800">{getCobroDisplay(service)}</span>
                  </div>
                )}
              </div>
              {service.notes && (
                <div className="mb-3 pt-2 border-t border-amber-200/30">
                  <span className="font-medium text-brown-700 block mb-1">Notas:</span>
                  <p className="text-xs italic text-gray-600">{service.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/30">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.estado)}`}>
                  {service.estado}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <motion.div
            className="text-center py-16 bg-white/90 rounded-3xl shadow-lg col-span-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No hay coincidencias' : '¡Sin servicios o visitas agendados!'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Ajusta la búsqueda o filtro.' 
                : 'Usa los botones arriba para agendar una visita rápida ($cobro) o servicio completo con Jonathan o Carlos ☕'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={openModalForVisita}
                className="px-6 py-3 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5" />
                Primera Visita
              </motion.button>
              <motion.button
                onClick={openModalForServicio}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wrench className="w-5 h-5" />
                Primer Servicio
              </motion.button>
            </div>
          </motion.div>
        )}

        <AddServiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsVisitaMode(false);
          }}
          clients={clients}
          equipments={equipments}
          onAddService={fetchData}
          initialTipo={initialTipo}
          isVisitaMode={isVisitaMode}
        />
      </div>
    </motion.div>
  );
};

export default ServicesList;