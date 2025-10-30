import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash } from 'lucide-react';
import { mockClients } from '../mock/data';

const Clients = () => {
  const [clients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClient, setExpandedClient] = useState(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedClient(expandedClient === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h2>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleExpand(client.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
                      <p className="text-gray-600">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-500">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-500">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expandedClient === client.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-gray-200 bg-white">
                      <h4 className="text-lg font-semibold mb-4">Equipos de {client.name}</h4>
                      <div className="space-y-3">
                        {client.equipment.map((eq) => (
                          <div key={eq.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{eq.type} - {eq.model}</p>
                              <p className="text-sm text-gray-600">Serial: {eq.serial}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              eq.status === 'Activo' ? 'bg-green-100 text-green-800' :
                              eq.status === 'En Reparación' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {eq.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      {client.equipment.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay equipos registrados. ¡Agrega uno!</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay clientes</h3>
          <p className="text-gray-500">Empieza agregando tu primer cliente.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Clients;