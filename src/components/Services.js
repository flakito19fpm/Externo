import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Search, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { mockServices } from '../mock/data';

const Services = () => {
  const [services] = useState(mockServices);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'Pendiente', label: 'Pendientes' },
    { value: 'En Progreso', label: 'En Progreso' },
    { value: 'Completado', label: 'Completados' }
  ];

  const getStatusIcon = (status) => {
    if (status === 'Completado') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'En Progreso') return <Clock className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Settings className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Servicios</h2>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Servicio
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full bg-gray-100 mr-4`}>
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{service.description}</h3>
                    <p className="text-gray-600">Técnico: {service.technician}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  service.status === 'Completado' ? 'bg-green-100 text-green-800' :
                  service.status === 'En Progreso' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <p><span className="font-medium">Asignado:</span> {service.assignedDate}</p>
                <p><span className="font-medium">Estimado:</span> {service.estimatedCompletion}</p>
                <p><span className="font-medium">Cliente ID:</span> {service.clientId}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredServices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay servicios</h3>
          <p className="text-gray-500">Crea tu primer servicio para empezar.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Services;