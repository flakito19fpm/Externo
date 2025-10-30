import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Phone, Building, User, Coffee, Plus, Settings } from 'lucide-react';
import AddClientModal from './AddClientModal';
import AddEquipmentModal from './AddEquipmentModal';
import { supabase } from '../utils/supabase';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*, equipos(*)')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sucursal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.zona?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (newClient) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleAddEquipment = (newEquipment) => {
    setClients(prev => prev.map(client => 
      client.id === selectedClientId 
        ? { ...client, equipos: [...(client.equipos || []), newEquipment] }
        : client
    ));
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'En Reparación': return 'bg-yellow-100 text-yellow-800';
      case 'En Almacén': return 'bg-blue-100 text-blue-800';
      case 'Desecho': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-cream-50 via-amber-50 to-orange-50 py-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-brown-700 to-amber-600 bg-clip-text text-transparent"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Clientes Cafeteros
            </motion.h2>
            <p className="text-gray-600 mt-2">{filteredClients.length} clientes registrados</p>
          </div>
          <motion.button
            onClick={() => setIsClientModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 self-start sm:self-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-5 h-5" />
            Nuevo Cliente
          </motion.button>
        </motion.div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, sucursal o zona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/90 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder-gray-500"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
        </div>

        {filteredClients.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white/90 rounded-3xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Users className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">¡Sin clientes aún!</h3>
            <p className="text-gray-500 mb-6">Agrega tu primer cliente para organizar el taller y programar visitas.</p>
            <motion.button
              onClick={() => setIsClientModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Agregar Primer Cliente
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-amber-200/50 hover:shadow-2xl transition-all duration-300 relative"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl">
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-brown-800">{client.nombre_cliente}</h3>
                      <p className="text-sm text-gray-600">Sucursal: {client.sucursal}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setIsEquipmentModalOpen(true);
                    }}
                    className="p-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-700 font-medium">{client.sucursal}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-700">{client.telefono}</span>
                  </div>
                  {client.direccion && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="text-gray-700">{client.direccion}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 text-amber-600">📍</span>
                    <span className="text-gray-700 font-medium bg-amber-100 px-2 py-1 rounded-full text-xs">{client.zona}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-200/50">
                  <h4 className="font-semibold text-brown-700 mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Equipos ({client.equipos?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {client.equipos?.length > 0 ? (
                      client.equipos.map((equip) => (
                        <motion.div
                          key={equip.id}
                          className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-brown-800 text-sm">{equip.tipo}: {equip.marca} {equip.modelo}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEstadoColor(equip.estado)}`}>
                              {equip.estado}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">Serie: {equip.serie}</p>
                          {equip.observaciones && (
                            <p className="text-xs text-gray-700 italic">Obs: {equip.observaciones}</p>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-gray-400" />
                        Sin equipos aún
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AddClientModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          onAddClient={handleAddClient}
        />
        <AddEquipmentModal
          isOpen={isEquipmentModalOpen}
          onClose={() => setIsEquipmentModalOpen(false)}
          clientId={selectedClientId}
          onAddEquipment={handleAddEquipment}
        />
      </div>
    </motion.div>
  );
};

export default ClientList;